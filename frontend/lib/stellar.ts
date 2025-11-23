import * as StellarSdk from "@stellar/stellar-sdk"
import { isConnected, requestAccess, getAddress, signTransaction } from "@stellar/freighter-api"

// Stellar Network configuration
export const SERVER = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org")
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET

export async function checkFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected()
    return result.isConnected
  } catch (error) {
    console.error("[v0] Error checking Freighter:", error)
    return false
  }
}

export async function connectFreighter(): Promise<string | null> {
  try {
    const result = await requestAccess()

    if (result.error) {
      throw new Error(result.error)
    }

    return result.address || null
  } catch (error) {
    console.error("[v0] Error connecting to Freighter:", error)
    throw error
  }
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    const result = await getAddress()

    if (result.error) {
      return null
    }

    return result.address || null
  } catch (error) {
    console.error("[v0] Error getting wallet address:", error)
    return null
  }
}

// Helper to get account balance
export async function getAccountBalance(publicKey: string): Promise<string> {
  try {
    const account = await SERVER.loadAccount(publicKey)
    const nativeBalance = account.balances.find((balance) => balance.asset_type === "native")
    return nativeBalance?.balance || "0"
  } catch (error) {
    console.error("[v0] Error fetching balance:", error)
    return "0"
  }
}

export async function sendPayment(
  sourcePublicKey: string,
  destinationId: string,
  amount: string,
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    // Check if Freighter is connected
    const isFreighterConnected = await checkFreighterInstalled()
    if (!isFreighterConnected) {
      return { success: false, error: "Freighter wallet not available" }
    }

    const sourceAccount = await SERVER.loadAccount(sourcePublicKey)

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationId,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }),
      )
      .setTimeout(30)
      .build()

    // Sign with Freighter using official API
    const signedResult = await signTransaction(transaction.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
      address: sourcePublicKey,
    })

    if (signedResult.error) {
      throw new Error(signedResult.error)
    }

    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedResult.signedTxXdr, NETWORK_PASSPHRASE)

    const result = await SERVER.submitTransaction(transactionToSubmit as StellarSdk.Transaction)

    return { success: true, hash: result.hash }
  } catch (error) {
    console.error("[v0] Payment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    }
  }
}

// Format XLM amount for display
export function formatXLM(amount: string | number): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return num.toFixed(2)
}

// Convert USD to XLM (simplified - in production, use real exchange rate)
export function convertUSDtoXLM(usd: number): string {
  // Simplified conversion: 1 XLM = ~0.10 USD
  const xlmAmount = usd / 0.1
  return xlmAmount.toFixed(7)
}

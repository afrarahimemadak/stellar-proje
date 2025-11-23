"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Home, LogOut } from "lucide-react"
import { getAccountBalance, formatXLM } from "@/lib/stellar"

interface AppHeaderProps {
  showBalance?: boolean
}

export function AppHeader({ showBalance = true }: AppHeaderProps) {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState("")
  const [userType, setUserType] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  useEffect(() => {
    const wallet = localStorage.getItem("walletAddress")
    const type = localStorage.getItem("userType")

    if (wallet) {
      setWalletAddress(wallet)
      setUserType(type)

      if (showBalance) {
        loadBalance(wallet)
      }
    }
  }, [showBalance])

  const loadBalance = async (wallet: string) => {
    setIsLoadingBalance(true)
    try {
      const bal = await getAccountBalance(wallet)
      setBalance(bal)
    } catch (error) {
      console.error("[v0] Failed to load balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("userType")
    localStorage.removeItem("currentProfile")
    router.push("/")
  }

  const refreshBalance = () => {
    if (walletAddress) {
      loadBalance(walletAddress)
    }
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/marketplace")}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">StellarWork</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showBalance && walletAddress && (
              <button
                onClick={refreshBalance}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span className="font-semibold">{isLoadingBalance ? "..." : `${formatXLM(balance)} XLM`}</span>
              </button>
            )}

            {userType && (
              <Badge variant="outline" className="text-sm capitalize">
                {userType}
              </Badge>
            )}

            {walletAddress && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm">
                <span className="font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={() => router.push("/marketplace")} className="hidden md:flex">
              <Home className="w-4 h-4 mr-2" />
              Marketplace
            </Button>

            {walletAddress && (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Disconnect</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

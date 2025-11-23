"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, AlertCircle, CheckCircle2 } from "lucide-react"
import { convertUSDtoXLM, formatXLM } from "@/lib/stellar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FreelancerJob } from "@/lib/api"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  freelancer: FreelancerJob
  onPaymentSuccess: () => void
}

export function PaymentDialog({ open, onOpenChange, freelancer, onPaymentSuccess }: PaymentDialogProps) {
  const [hours, setHours] = useState("1")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [txHash, setTxHash] = useState("")

  const hourlyRate = freelancer.hourly_rate || freelancer.budget
  const totalUSD = Number.parseFloat(hours) * hourlyRate
  const totalXLM = convertUSDtoXLM(totalUSD)

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("idle")
    setErrorMessage("")

    try {
      const walletAddress = localStorage.getItem("walletAddress")
      if (!walletAddress) {
        throw new Error("Wallet not connected")
      }

      // For now, we'll show an error since we don't have wallet address in FreelancerJob
      throw new Error("Freelancer wallet address not available. Backend integration needed.")

      // Placeholder for future implementation:
      // const result = await sendPayment(walletAddress, freelancerWalletAddress, totalXLM)
    } catch (error) {
      setPaymentStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Pay with XLM
          </DialogTitle>
          <DialogDescription>Send payment to freelancer for their services</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4 p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Job Title:</span>
              <span className="font-medium">{freelancer.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hourly Rate:</span>
              <span className="font-medium">${hourlyRate}/hr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono text-xs">{freelancer.user_id}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Number of Hours</Label>
            <Input
              id="hours"
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="space-y-3 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total (USD):</span>
              <span className="text-xl font-bold">${totalUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount in XLM:</span>
              <span className="text-lg font-semibold text-primary">{formatXLM(totalXLM)} XLM</span>
            </div>
            <p className="text-xs text-muted-foreground">Exchange rate: 1 XLM ≈ $0.10 (for demonstration)</p>
          </div>

          {paymentStatus === "success" && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                Payment successful! Transaction hash: {txHash.slice(0, 8)}...
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === "error" && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !hours || Number.parseFloat(hours) <= 0}
              className="flex-1"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : `Pay ${formatXLM(totalXLM)} XLM`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

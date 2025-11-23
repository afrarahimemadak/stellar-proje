"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Users, Briefcase, Star, Shield, Zap, AlertCircle } from "lucide-react"
import { checkFreighterInstalled, connectFreighter } from "@/lib/stellar"
import { checkUserExists } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkInstallation() {
      const isInstalled = await checkFreighterInstalled()
      console.log("[v0] Freighter installed:", isInstalled)
      setIsFreighterInstalled(isInstalled)
    }

    checkInstallation()
  }, [])

  const handleConnect = async (userType: "freelancer" | "employer") => {
    setIsConnecting(true)
    setError(null)

    try {
      const isInstalled = await checkFreighterInstalled()

      if (!isInstalled) {
        window.open("https://www.freighter.app/", "_blank")
        setError("Please install the Freighter wallet extension and refresh the page.")
        setIsConnecting(false)
        return
      }

      console.log("[v0] Connecting to Freighter...")
      const publicKey = await connectFreighter()
      console.log("[v0] Connected with public key:", publicKey)

      if (publicKey) {
        const { exists, user } = await checkUserExists(publicKey)
        console.log("[v0] User exists:", exists, user)

        // Store user info locally for session
        localStorage.setItem("userType", userType)
        localStorage.setItem("walletAddress", publicKey)

        if (exists && user) {
          if (user.user_type !== userType) {
            toast({
              title: "Role Mismatch",
              description: `This wallet is registered as ${user.user_type}. Redirecting...`,
              variant: "destructive",
            })
            localStorage.setItem("userType", user.user_type)
            localStorage.setItem("userId", user.id?.toString() || "")
          } else {
            localStorage.setItem("userId", user.id?.toString() || "")
            toast({
              title: "Welcome back!",
              description: `Connected as ${user.full_name}`,
            })
          }

          router.push("/marketplace")
        } else {
          if (userType === "freelancer") {
            router.push("/freelancer/register")
          } else {
            router.push("/employer/register")
          }
        }
      }
    } catch (error) {
      console.error("[v0] Connection error:", error)
      setError(error instanceof Error ? error.message : "Failed to connect to Freighter wallet. Please try again.")
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StellarWork</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/marketplace")}>
            Marketplace
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="w-4 h-4" />
            <span>Powered by Stellar Network</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
            Decentralized freelance marketplace
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Connect your Freighter wallet to get started. Hire talented freelancers or offer your services with instant
            XLM payments.
          </p>

          {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-8">
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer group">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 text-left">
                  <CardTitle className="text-2xl">I'm a Freelancer</CardTitle>
                  <CardDescription className="text-base">
                    Showcase your skills, set your hourly rate, and receive instant XLM payments
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleConnect("freelancer")}
                  disabled={isConnecting}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect as Freelancer"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-colors cursor-pointer group">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-2 text-left">
                  <CardTitle className="text-2xl">I'm an Employer</CardTitle>
                  <CardDescription className="text-base">
                    Post projects, find talent, and pay securely with XLM cryptocurrency
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  variant="secondary"
                  onClick={() => handleConnect("employer")}
                  disabled={isConnecting}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect as Employer"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {!isFreighterInstalled && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Don't have Freighter wallet?
                <Button
                  variant="link"
                  className="px-2 text-primary"
                  onClick={() => window.open("https://www.freighter.app/", "_blank")}
                >
                  Install it here
                </Button>
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Secure Payments</h3>
            <p className="text-muted-foreground">
              All transactions powered by Stellar blockchain for maximum security and transparency
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Instant Transfers</h3>
            <p className="text-muted-foreground">Send and receive XLM payments in seconds with minimal fees</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Global Network</h3>
            <p className="text-muted-foreground">Connect with talent worldwide without borders or bank limitations</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Built on Stellar Testnet</span>
            </div>
            <p className="text-sm text-muted-foreground">2025 StellarWork. Decentralized freelancing platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

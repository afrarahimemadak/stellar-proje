"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { useToast } from "@/hooks/use-toast"
import { createUser, createEmployerJob } from "@/lib/api"

export default function EmployerRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    projectTitle: "",
    projectDescription: "",
    budget: "",
    duration: "",
    skills: "",
  })

  useEffect(() => {
    const wallet = localStorage.getItem("walletAddress")
    const userType = localStorage.getItem("userType")

    if (!wallet || userType !== "employer") {
      router.push("/")
      return
    }

    setWalletAddress(wallet)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Creating employer user in backend...")
      const user = await createUser({
        full_name: formData.contactPerson,
        wallet_address: walletAddress,
        email: formData.email,
        user_type: "employer",
      })

      console.log("[v0] Employer user created:", user)
      localStorage.setItem("userId", user.id?.toString() || "")

      console.log("[v0] Creating employer project...")
      const employerJob = await createEmployerJob({
        user_id: user.id!,
        title: formData.projectTitle,
        description: formData.projectDescription,
        salary: Number.parseFloat(formData.budget),
        duration: formData.duration,
        skills: formData.skills.split(",").map((s) => s.trim()),
      })

      console.log("[v0] Employer project created:", employerJob)

      toast({
        title: "Project Posted!",
        description: "Your project has been successfully posted to the marketplace.",
      })

      router.push("/marketplace")
    } catch (error) {
      console.error("[v0] Error creating employer profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBalance={true} />

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Create Your Employer Profile</h1>
            <p className="text-muted-foreground text-lg">Tell us about your company and your first project</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>This information will be visible to freelancers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => handleChange("contactPerson", e.target.value)}
                        placeholder="Jane Smith"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="jane@acme.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Your First Project</h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectTitle">Project Title *</Label>
                      <Input
                        id="projectTitle"
                        value={formData.projectTitle}
                        onChange={(e) => handleChange("projectTitle", e.target.value)}
                        placeholder="Build a DeFi Dashboard"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Project Description *</Label>
                      <Textarea
                        id="projectDescription"
                        value={formData.projectDescription}
                        onChange={(e) => handleChange("projectDescription", e.target.value)}
                        placeholder="We need a talented developer to build a comprehensive DeFi dashboard that displays..."
                        rows={5}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget (USD) *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="budget"
                            type="number"
                            min="1"
                            step="0.01"
                            value={formData.budget}
                            onChange={(e) => handleChange("budget", e.target.value)}
                            placeholder="5000"
                            className="pl-7"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Project Duration *</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => handleChange("duration", e.target.value)}
                          placeholder="2-3 months"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Required Skills (comma separated) *</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => handleChange("skills", e.target.value)}
                        placeholder="React, Solidity, Web3.js, Stellar SDK"
                        required
                      />
                      <p className="text-sm text-muted-foreground">Separate each skill with a comma</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Post Project & Continue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

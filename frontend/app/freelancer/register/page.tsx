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
import { createUser, createFreelancerJob } from "@/lib/api"

export default function FreelancerRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    bio: "",
    hourlyRate: "",
    skills: "",
    equipment: "",
    experience: "",
    availability: "full-time",
  })

  useEffect(() => {
    const wallet = localStorage.getItem("walletAddress")
    const userType = localStorage.getItem("userType")

    if (!wallet || userType !== "freelancer") {
      router.push("/")
      return
    }

    setWalletAddress(wallet)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Creating user in backend...")
      const user = await createUser({
        full_name: formData.name,
        wallet_address: walletAddress,
        email: formData.email,
        user_type: "freelancer",
      })

      console.log("[v0] User created:", user)
      localStorage.setItem("userId", user.id?.toString() || "")

      console.log("[v0] Creating freelancer profile...")
      const freelancerJob = await createFreelancerJob({
        user_id: user.id!,
        title: formData.title,
        description: formData.bio,
        budget: Number.parseFloat(formData.hourlyRate),
        hourly_rate: Number.parseFloat(formData.hourlyRate),
        skills: formData.skills.split(",").map((s) => s.trim()),
        equipment: formData.equipment,
        experience: formData.experience,
        availability: formData.availability,
      })

      console.log("[v0] Freelancer profile created:", freelancerJob)

      toast({
        title: "Profile Created!",
        description: "Your freelancer profile has been successfully created.",
      })

      router.push("/marketplace")
    } catch (error) {
      console.error("[v0] Error creating profile:", error)
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
            <h1 className="text-4xl font-bold text-foreground">Create Your Freelancer Profile</h1>
            <p className="text-muted-foreground text-lg">Fill in your details to start receiving project offers</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>This information will be visible to potential employers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Full Stack Developer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell employers about yourself, your experience, and what makes you unique..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="1"
                        step="0.01"
                        value={formData.hourlyRate}
                        onChange={(e) => handleChange("hourlyRate", e.target.value)}
                        placeholder="50"
                        className="pl-7"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability *</Label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => handleChange("availability", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="project-based">Project-based</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated) *</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleChange("skills", e.target.value)}
                    placeholder="React, Node.js, TypeScript, Stellar SDK"
                    required
                  />
                  <p className="text-sm text-muted-foreground">Separate each skill with a comma</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment & Tools *</Label>
                  <Textarea
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e) => handleChange("equipment", e.target.value)}
                    placeholder="MacBook Pro M2, 32GB RAM, VSCode, Figma, etc."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience & Portfolio *</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    placeholder="5+ years building Web3 applications. Previous clients include..."
                    rows={3}
                    required
                  />
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
                    {isSubmitting ? "Creating Profile..." : "Create Profile & Continue"}
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

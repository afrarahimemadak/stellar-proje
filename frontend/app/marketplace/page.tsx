"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, DollarSign, Star, Clock, Loader2 } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { PaymentDialog } from "@/components/payment-dialog"
import { getFreelancerJobs, getEmployerJobs, type FreelancerJob, type EmployerJob } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function MarketplacePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userType, setUserType] = useState<string | null>(null)
  const [freelancers, setFreelancers] = useState<FreelancerJob[]>([])
  const [projects, setProjects] = useState<EmployerJob[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerJob | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const wallet = localStorage.getItem("walletAddress")
    const type = localStorage.getItem("userType")

    if (!wallet || !type) {
      router.push("/")
      return
    }

    setUserType(type)

    async function fetchData() {
      try {
        console.log("[v0] Fetching freelancer jobs from API...")
        const freelancerJobs = await getFreelancerJobs()
        console.log("[v0] Freelancer jobs fetched:", freelancerJobs)
        setFreelancers(freelancerJobs)

        console.log("[v0] Fetching employer jobs from API...")
        const employerJobs = await getEmployerJobs()
        console.log("[v0] Employer jobs fetched:", employerJobs)
        setProjects(employerJobs)
      } catch (error) {
        console.error("[v0] Error fetching marketplace data:", error)
        toast({
          title: "Error",
          description: "Failed to load marketplace data. Please check backend connection.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, toast])

  const filteredFreelancers = freelancers.filter(
    (freelancer) =>
      searchQuery === "" ||
      freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleHireFreelancer = (freelancer: FreelancerJob) => {
    setSelectedFreelancer(freelancer)
    setIsPaymentDialogOpen(true)
  }

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "The hourly rate has been sent to the freelancer.",
    })
    setIsPaymentDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader showBalance={true} />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBalance={true} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, or skills..."
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-border">
          <button className="pb-3 px-1 border-b-2 border-primary text-primary font-medium">
            Freelancers ({filteredFreelancers.length})
          </button>
          <button className="pb-3 px-1 border-b-2 border-transparent text-muted-foreground hover:text-foreground">
            Projects ({projects.length})
          </button>
        </div>

        {filteredFreelancers.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No freelancers found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "Be the first to create a freelancer profile!"}
                </p>
              </div>
              {!searchQuery && userType === "freelancer" && (
                <Button onClick={() => router.push("/freelancer/register")}>Create Your Profile</Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:border-primary transition-colors group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold">
                      {freelancer.title.charAt(0).toUpperCase()}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {freelancer.availability || "Available"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {freelancer.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-1">
                    ID: {freelancer.user_id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{freelancer.description}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-primary font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>${freelancer.hourly_rate || freelancer.budget}/hr</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>New</span>
                    </div>
                  </div>

                  {freelancer.skills && freelancer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{freelancer.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {userType === "employer" ? (
                    <Button className="w-full mt-4" onClick={() => handleHireFreelancer(freelancer)}>
                      Pay Hourly Rate
                    </Button>
                  ) : (
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      View Profile
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {userType === "freelancer" && projects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:border-accent transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">Open</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1.5 text-accent font-semibold">
                        <DollarSign className="w-4 h-4" />
                        <span>${project.salary.toLocaleString()}</span>
                      </div>
                      {project.duration && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{project.duration}</span>
                        </div>
                      )}
                    </div>

                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button className="w-full" variant="default">
                      Apply to Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedFreelancer && (
        <PaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          freelancer={selectedFreelancer}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

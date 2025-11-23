// Type definitions for the platform
export type UserType = "freelancer" | "employer"

export interface FreelancerProfile {
  id?: number
  userId?: number
  walletAddress: string
  name: string
  title: string
  bio: string
  hourlyRate: number
  skills: string[]
  equipment: string
  experience: string
  availability: string
  createdAt?: Date
}

export interface EmployerProfile {
  id?: number
  userId?: number
  walletAddress: string
  companyName: string
  contactPerson: string
  email: string
  createdAt?: Date
}

export interface Project {
  id: string
  employerWallet: string
  title: string
  description: string
  budget: number
  duration: string
  skills: string[]
  createdAt: Date
  status: "open" | "in-progress" | "completed"
}

// API response types
export interface ApiUser {
  id: number
  full_name: string
  wallet_address: string
  email: string
  user_type: "freelancer" | "employer"
}

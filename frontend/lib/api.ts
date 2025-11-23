import axios from "axios"

// Backend API base URL - production'da environment variable kullanılmalı
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Type definitions matching backend API
export interface User {
  id?: number
  full_name: string
  wallet_address: string
  email: string
  user_type: "freelancer" | "employer"
}

export interface FreelancerJob {
  id?: number
  user_id: number
  title: string
  description: string
  budget: number
  skills?: string[]
  hourly_rate?: number
  availability?: string
  equipment?: string
  experience?: string
  created_at?: string
}

export interface EmployerJob {
  id?: number
  user_id: number
  title: string
  description: string
  salary: number
  duration?: string
  skills?: string[]
  created_at?: string
}

// API Functions

// Users
export async function createUser(userData: Omit<User, "id">): Promise<User> {
  const response = await apiClient.post("/users", userData)
  return response.data
}

export async function getAllUsers(): Promise<User[]> {
  const response = await apiClient.get("/users")
  return response.data
}

export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  try {
    const users = await getAllUsers()
    return users.find((user) => user.wallet_address === walletAddress) || null
  } catch (error) {
    console.error("[v0] Error fetching user by wallet:", error)
    return null
  }
}

// Freelancer Jobs
export async function createFreelancerJob(jobData: Omit<FreelancerJob, "id" | "created_at">): Promise<FreelancerJob> {
  const response = await apiClient.post("/freelancer/jobs", jobData)
  return response.data
}

export async function getFreelancerJobs(): Promise<FreelancerJob[]> {
  const response = await apiClient.get("/freelancer/jobs")
  return response.data
}

// Employer Jobs
export async function createEmployerJob(jobData: Omit<EmployerJob, "id" | "created_at">): Promise<EmployerJob> {
  const response = await apiClient.post("/employer/jobs", jobData)
  return response.data
}

export async function getEmployerJobs(): Promise<EmployerJob[]> {
  const response = await apiClient.get("/employer/jobs")
  return response.data
}

// Helper function to check if user exists
export async function checkUserExists(walletAddress: string): Promise<{ exists: boolean; user?: User }> {
  const user = await getUserByWallet(walletAddress)
  return {
    exists: !!user,
    user: user || undefined,
  }
}

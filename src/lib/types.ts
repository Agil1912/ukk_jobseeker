// User Types
export interface User {
  id: string
  email: string
  name: string
  role: "JOBSEEKER" | "HRD"
  createdAt: string
}

export interface JobSeeker extends User {
  role: "JOBSEEKER"
  phone?: string
  address?: string
  skills?: string[]
  bio?: string
  portfolio?: Portfolio[]
}

export interface HRD extends User {
  role: "HRD"
  companyName: string
  companyAddress?: string
  companyDescription?: string
}

// Portfolio
export interface Portfolio {
  id: string
  title: string
  description: string
  link?: string
  fileUrl?: string
  createdAt: string
}

// Job
export interface Job {
  id: string
  hrdId: string
  companyName: string
  position: string
  description: string
  location: string
  salary?: string
  requirements?: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

// Application
export interface Application {
  id: string
  jobId: string
  jobSeekerId: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: string
  job?: Job
  jobSeeker?: JobSeeker
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterJobSeekerRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterHRDRequest {
  companyName: string
  email: string
  password: string
  confirmPassword: string
  companyAddress?: string
  companyDescription?: string
}

export interface AuthResponse {
  token: string
  role: string
  success: boolean
  user: User
}

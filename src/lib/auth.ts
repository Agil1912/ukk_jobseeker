import api from "./api"
import type { LoginRequest, RegisterJobSeekerRequest, RegisterHRDRequest, AuthResponse, User } from "./types"

export const authService = {
  // Login
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      document.cookie = `token=${response.data.token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
      document.cookie = `role=${response.data.user.role}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
    return response.data
  },

  // Register Job Seeker
  async registerJobSeeker(data: RegisterJobSeekerRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register/jobseeker", data)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      document.cookie = `token=${response.data.token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
      document.cookie = `role=${response.data.user.role}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
    return response.data
  },

  // Register HRD
  async registerHRD(data: RegisterHRDRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register/hrd", data)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      document.cookie = `token=${response.data.token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
      document.cookie = `role=${response.data.user.role}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
    return response.data
  },

  // Logout
  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax"
    document.cookie = "role=; Path=/; Max-Age=0; SameSite=Lax"
    window.location.href = "/"
  },

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  },
}

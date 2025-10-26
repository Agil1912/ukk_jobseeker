import api from "./api"
import type { LoginRequest, RegisterJobSeekerRequest, RegisterHRDRequest, AuthResponse, User } from "./types"

export const authService = {
  // Login
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.user.login(data)
    if (response.data?.token && response.data?.user) {
      return {
        token: response.data.token,
        user: response.data.user,
        role: response.data.user.role,
        success: true
      }
    }
    throw new Error(response.message || "Login failed")
  },

  // Register Job Seeker
  async registerJobSeeker(data: RegisterJobSeekerRequest): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("role", "Society")
    
    const response = await api.user.register(formData)
    if (response.data) {
      // After registration, login automatically
      return this.login({ email: data.email, password: data.password })
    }
    throw new Error(response.message || "Registration failed")
  },

  // Register HRD
  async registerHRD(data: RegisterHRDRequest): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append("name", data.companyName)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("role", "HRD")
    
    const response = await api.user.register(formData)
    if (response.data) {
      // After registration, login automatically
      return this.login({ email: data.email, password: data.password })
    }
    throw new Error(response.message || "Registration failed")
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

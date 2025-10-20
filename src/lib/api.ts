import axios from "axios"

// Use local API for development, external API for production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://learn.smktelkom-mlg.sch.id/jobsheeker/"
  : "/api"

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(process.env.NODE_ENV === 'production' && {
      "APP-KEY": "441439f74c994f1c9641e7eb6cadd7ae12fa1e72"
    })
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      console.log(error)
      // window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api

"use client"

import { useState, useEffect } from "react"
import { authService } from "@/lib/auth"
import type { User } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
    
useEffect(() => {
    const currentUserRole = localStorage.getItem("role") 
    console.log("Current user:", currentUserRole)
    setUser(currentUserRole)
    setLoading(false)
}, [])

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isJobSeeker: user === "JOBSEEKER",
    isHRD: user === "HRD",
    logout,
  }
}

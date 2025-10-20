"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./use-auth"

interface UseAuthGuardOptions {
  requiredRole?: "HRD" | "JOBSEEKER"
  redirectTo?: string
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const { requiredRole, redirectTo = "/login" } = options

  useEffect(() => {
    if (loading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // If specific role is required and user doesn't have it
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      if (user?.role === "HRD") {
        router.push("/hrd/dashboard")
      } else if (user?.role === "JOBSEEKER") {
        router.push("/jobseeker/jobs")
      } else {
        router.push("/login")
      }
      return
    }
  }, [isAuthenticated, user, loading, requiredRole, redirectTo, router])

  return {
    isAuthenticated,
    user,
    loading,
    isAuthorized: isAuthenticated && (!requiredRole || user?.role === requiredRole)
  }
}
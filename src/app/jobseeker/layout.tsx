"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"

export default function JobSeekerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isJobSeeker } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isJobSeeker)) {
      // router.push("/login")
    }
  }, [user, loading, isJobSeeker])

  if (loading || !user || !isJobSeeker) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  )
}

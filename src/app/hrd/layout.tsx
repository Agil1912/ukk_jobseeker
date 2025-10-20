"use client"

import React, { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"

type HRDLayoutProps = {
  children: ReactNode
}

export default function HRDLayout({ children }: HRDLayoutProps) {
  const { user, loading, isHRD }: { user: any; loading: boolean; isHRD: boolean } = useAuth()
  const router = useRouter()

  console.log(isHRD)

  useEffect(() => {
    if (!loading && (!user || !isHRD)) {
        console.log("You;re not authenticated")
        setTimeout(() => {
        }, 2000)
    }
  }, [user, loading, isHRD])

  if ( !user || !isHRD) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  )
}

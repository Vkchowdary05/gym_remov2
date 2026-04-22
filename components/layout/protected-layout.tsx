"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { WorkoutProvider } from "@/contexts/workout-context"
import { Navbar } from "./navbar"
import { Loader2 } from "lucide-react"

interface ProtectedLayoutProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

export function ProtectedLayout({ children, requireOnboarding = true }: ProtectedLayoutProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (!loading && user && requireOnboarding && !profile?.onboarded) {
      router.push("/onboarding")
    }
  }, [user, profile, loading, router, requireOnboarding])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </WorkoutProvider>
  )
}

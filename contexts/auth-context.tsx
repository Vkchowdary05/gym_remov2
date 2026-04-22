"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface UserProfile {
  name: string
  gender: "male" | "female" | "other"
  weight: number
  height: number
  onboarded: boolean
}

interface StrengthAssessment {
  benchPress: number
  squat: number
  deadlift: number
  shoulderPress: number
  barbellRow: number
  overheadPress: number
  legPress: number
  pullUps: number
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  strengthAssessment: StrengthAssessment | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  googleSignIn: () => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>
  updateStrengthAssessment: (assessment: StrengthAssessment) => Promise<void>
  completeOnboarding: (profile: UserProfile, assessment: StrengthAssessment) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [strengthAssessment, setStrengthAssessment] = useState<StrengthAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("gym-remo-user")
    const savedProfile = localStorage.getItem("gym-remo-profile")
    const savedAssessment = localStorage.getItem("gym-remo-assessment")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
    if (savedAssessment) {
      setStrengthAssessment(JSON.parse(savedAssessment))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call - in production, replace with Firebase Auth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        photoURL: null,
      }

      setUser(mockUser)
      localStorage.setItem("gym-remo-user", JSON.stringify(mockUser))

      // Check if user has completed onboarding
      const savedProfile = localStorage.getItem(`gym-remo-profile-${mockUser.uid}`)
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
        localStorage.setItem("gym-remo-profile", JSON.stringify(parsedProfile))
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    } catch (err) {
      setError("Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        photoURL: null,
      }

      setUser(mockUser)
      localStorage.setItem("gym-remo-user", JSON.stringify(mockUser))
      router.push("/onboarding")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    setProfile(null)
    setStrengthAssessment(null)
    localStorage.removeItem("gym-remo-user")
    localStorage.removeItem("gym-remo-profile")
    localStorage.removeItem("gym-remo-assessment")
    router.push("/")
  }

  const googleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        uid: `google_${Date.now()}`,
        email: "user@gmail.com",
        displayName: "Google User",
        photoURL: null,
      }

      setUser(mockUser)
      localStorage.setItem("gym-remo-user", JSON.stringify(mockUser))

      const savedProfile = localStorage.getItem(`gym-remo-profile-${mockUser.uid}`)
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
        localStorage.setItem("gym-remo-profile", JSON.stringify(parsedProfile))
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    } catch (err) {
      setError("Failed to sign in with Google.")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    if (!user) return

    const updated = { ...profile, ...newProfile } as UserProfile
    setProfile(updated)
    localStorage.setItem("gym-remo-profile", JSON.stringify(updated))
    localStorage.setItem(`gym-remo-profile-${user.uid}`, JSON.stringify(updated))
  }

  const updateStrengthAssessment = async (assessment: StrengthAssessment) => {
    if (!user) return

    setStrengthAssessment(assessment)
    localStorage.setItem("gym-remo-assessment", JSON.stringify(assessment))
    localStorage.setItem(`gym-remo-assessment-${user.uid}`, JSON.stringify(assessment))
  }

  const completeOnboarding = async (newProfile: UserProfile, assessment: StrengthAssessment) => {
    if (!user) return

    const profileWithOnboarding = { ...newProfile, onboarded: true }

    setProfile(profileWithOnboarding)
    setStrengthAssessment(assessment)

    localStorage.setItem("gym-remo-profile", JSON.stringify(profileWithOnboarding))
    localStorage.setItem(`gym-remo-profile-${user.uid}`, JSON.stringify(profileWithOnboarding))
    localStorage.setItem("gym-remo-assessment", JSON.stringify(assessment))
    localStorage.setItem(`gym-remo-assessment-${user.uid}`, JSON.stringify(assessment))

    router.push("/dashboard")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        strengthAssessment,
        loading,
        error,
        login,
        signup,
        logout,
        googleSignIn,
        updateProfile,
        updateStrengthAssessment,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

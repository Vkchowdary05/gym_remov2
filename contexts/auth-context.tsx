"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

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

// API response types
interface AuthApiResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserApiResponse
}

interface UserApiResponse {
  uid: string
  email: string
  displayName: string | null
  photoUrl: string | null
  profile: {
    name: string
    gender: string
    weight: number
    height: number
    fitnessGoal: string | null
    experienceLevel: string | null
    onboarded: boolean
    preferredTheme: string | null
    restTimerSeconds: number | null
  } | null
  strengthAssessment: {
    benchPress: number
    squat: number
    deadlift: number
    shoulderPress: number
    barbellRow: number
    overheadPress: number
    legPress: number
    pullUps: number
  } | null
}

function mapApiUserToState(apiUser: UserApiResponse) {
  const user: User = {
    uid: apiUser.uid,
    email: apiUser.email,
    displayName: apiUser.displayName,
    photoURL: apiUser.photoUrl,
  }

  const profile: UserProfile | null = apiUser.profile
    ? {
        name: apiUser.profile.name || "",
        gender: (apiUser.profile.gender as "male" | "female" | "other") || "male",
        weight: apiUser.profile.weight || 70,
        height: apiUser.profile.height || 175,
        onboarded: apiUser.profile.onboarded,
      }
    : null

  const strengthAssessment: StrengthAssessment | null = apiUser.strengthAssessment
    ? {
        benchPress: apiUser.strengthAssessment.benchPress || 0,
        squat: apiUser.strengthAssessment.squat || 0,
        deadlift: apiUser.strengthAssessment.deadlift || 0,
        shoulderPress: apiUser.strengthAssessment.shoulderPress || 0,
        barbellRow: apiUser.strengthAssessment.barbellRow || 0,
        overheadPress: apiUser.strengthAssessment.overheadPress || 0,
        legPress: apiUser.strengthAssessment.legPress || 0,
        pullUps: apiUser.strengthAssessment.pullUps || 0,
      }
    : null

  return { user, profile, strengthAssessment }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [strengthAssessment, setStrengthAssessment] = useState<StrengthAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("gymremo-access-token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const apiUser = await apiClient.get<UserApiResponse>("/auth/me")
        const state = mapApiUserToState(apiUser)
        setUser(state.user)
        setProfile(state.profile)
        setStrengthAssessment(state.strengthAssessment)
      } catch {
        // Token invalid or expired - clear it
        localStorage.removeItem("gymremo-access-token")
        localStorage.removeItem("gymremo-refresh-token")
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.post<AuthApiResponse>("/auth/login", {
        email,
        password,
      })

      localStorage.setItem("gymremo-access-token", response.accessToken)
      localStorage.setItem("gymremo-refresh-token", response.refreshToken)

      const state = mapApiUserToState(response.user)
      setUser(state.user)
      setProfile(state.profile)
      setStrengthAssessment(state.strengthAssessment)

      if (state.profile?.onboarded) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.post<AuthApiResponse>("/auth/signup", {
        email,
        password,
        displayName: email.split("@")[0],
      })

      localStorage.setItem("gymremo-access-token", response.accessToken)
      localStorage.setItem("gymremo-refresh-token", response.refreshToken)

      const state = mapApiUserToState(response.user)
      setUser(state.user)
      setProfile(state.profile)
      setStrengthAssessment(state.strengthAssessment)

      router.push("/onboarding")
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    setProfile(null)
    setStrengthAssessment(null)
    localStorage.removeItem("gymremo-access-token")
    localStorage.removeItem("gymremo-refresh-token")
    router.push("/")
  }

  const googleSignIn = async () => {
    setError("Google Sign-In coming soon! Please use email/password for now.")
  }

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    if (!user) return

    try {
      const apiUser = await apiClient.patch<UserApiResponse>("/users/me/profile", {
        name: newProfile.name,
        gender: newProfile.gender,
        weightKg: newProfile.weight,
        heightCm: newProfile.height,
      })

      const state = mapApiUserToState(apiUser)
      setProfile(state.profile)
    } catch (err: any) {
      // Fallback to local state update
      const updated = { ...profile, ...newProfile } as UserProfile
      setProfile(updated)
    }
  }

  const updateStrengthAssessment = async (assessment: StrengthAssessment) => {
    if (!user) return

    try {
      const apiUser = await apiClient.put<UserApiResponse>("/users/me/strength", {
        benchPressKg: assessment.benchPress,
        squatKg: assessment.squat,
        deadliftKg: assessment.deadlift,
        shoulderPressKg: assessment.shoulderPress,
        barbellRowKg: assessment.barbellRow,
        overheadPressKg: assessment.overheadPress,
        legPressKg: assessment.legPress,
        pullUpsMultiplier: assessment.pullUps,
      })

      const state = mapApiUserToState(apiUser)
      setStrengthAssessment(state.strengthAssessment)
    } catch (err: any) {
      // Fallback to local state
      setStrengthAssessment(assessment)
    }
  }

  const completeOnboarding = async (newProfile: UserProfile, assessment: StrengthAssessment) => {
    if (!user) return

    try {
      const apiUser = await apiClient.post<UserApiResponse>("/auth/onboarding", {
        name: newProfile.name,
        gender: newProfile.gender,
        weightKg: newProfile.weight,
        heightCm: newProfile.height,
        benchPressKg: assessment.benchPress,
        squatKg: assessment.squat,
        deadliftKg: assessment.deadlift,
        shoulderPressKg: assessment.shoulderPress,
        barbellRowKg: assessment.barbellRow,
        overheadPressKg: assessment.overheadPress,
        legPressKg: assessment.legPress,
        pullUpsMultiplier: assessment.pullUps,
      })

      const state = mapApiUserToState(apiUser)
      setProfile(state.profile)
      setStrengthAssessment(state.strengthAssessment)

      router.push("/dashboard")
    } catch (err: any) {
      // Fallback: save locally and proceed
      const profileWithOnboarding = { ...newProfile, onboarded: true }
      setProfile(profileWithOnboarding)
      setStrengthAssessment(assessment)
      router.push("/dashboard")
    }
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

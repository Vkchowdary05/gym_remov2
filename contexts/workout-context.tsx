"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { apiClient } from "@/lib/api"

export type MuscleGroup = "chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "forearms" | "cardio" | "neck" | "glutes" | "core" | "calves"

export interface WorkoutSet {
  weight: number
  reps: number
}

export interface ExerciseEntry {
  exerciseId: string
  exerciseName: string
  sets: WorkoutSet[]
}

export interface MuscleGroupEntry {
  muscleGroup: MuscleGroup
  exercises: ExerciseEntry[]
}

export interface Workout {
  id: string
  date: string
  muscleGroups: MuscleGroupEntry[]
  totalVolume: number
  totalSets: number
  notes?: string
}

interface WorkoutContextType {
  workouts: Workout[]
  loading: boolean
  error: string | null
  addWorkout: (workout: Omit<Workout, "id">) => Promise<void>
  updateWorkout: (id: string, workout: Partial<Workout>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
  getWorkout: (id: string) => Workout | undefined
  getRecentWorkouts: (limit?: number) => Workout[]
  getWorkoutsByDateRange: (start: Date, end: Date) => Workout[]
  getPersonalRecords: () => Record<string, { weight: number; date: string }>
}

// API response shape
interface WorkoutApiResponse {
  id: string
  date: string
  totalVolume: number
  totalSets: number
  durationMinutes: number | null
  notes: string | null
  perceivedExertion: number | null
  mood: string | null
  muscleGroups: {
    muscleGroup: string
    exercises: {
      exerciseId: string
      exerciseName: string
      notes: string | null
      sets: {
        weight: number
        reps: number
        rpe: number | null
        isWarmup: boolean | null
        isDropSet: boolean | null
        isPersonalRecord: boolean | null
        restSecondsAfter: number | null
      }[]
    }[]
  }[]
}

function mapApiWorkout(api: WorkoutApiResponse): Workout {
  return {
    id: api.id,
    date: api.date,
    totalVolume: api.totalVolume || 0,
    totalSets: api.totalSets || 0,
    notes: api.notes || undefined,
    muscleGroups: (api.muscleGroups || []).map((mg) => ({
      muscleGroup: mg.muscleGroup as MuscleGroup,
      exercises: (mg.exercises || []).map((ex) => ({
        exerciseId: ex.exerciseId || "",
        exerciseName: ex.exerciseName,
        sets: (ex.sets || []).map((s) => ({
          weight: s.weight || 0,
          reps: s.reps || 0,
        })),
      })),
    })),
  }
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch workouts when user is available
  useEffect(() => {
    if (user) {
      fetchWorkouts()
    } else {
      setWorkouts([])
      setLoading(false)
    }
  }, [user])

  const fetchWorkouts = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<WorkoutApiResponse[]>("/workouts")
      setWorkouts(data.map(mapApiWorkout))
    } catch (err) {
      // Fallback to localStorage if API is unavailable
      const savedWorkouts = localStorage.getItem(`gym-remo-workouts-${user?.uid}`)
      if (savedWorkouts) {
        setWorkouts(JSON.parse(savedWorkouts))
      }
    } finally {
      setLoading(false)
    }
  }

  const addWorkout = async (workout: Omit<Workout, "id">) => {
    try {
      const requestBody = {
        date: workout.date,
        notes: workout.notes,
        muscleGroups: workout.muscleGroups.map((mg) => ({
          muscleGroup: mg.muscleGroup,
          exercises: mg.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            sets: ex.sets.map((s) => ({
              weightKg: s.weight,
              reps: s.reps,
            })),
          })),
        })),
      }

      const response = await apiClient.post<WorkoutApiResponse>("/workouts", requestBody)
      const newWorkout = mapApiWorkout(response)
      setWorkouts((prev) => [newWorkout, ...prev])
    } catch (err) {
      // Fallback: save locally
      const newWorkout: Workout = {
        ...workout,
        id: `workout_${Date.now()}`,
      }
      const updated = [newWorkout, ...workouts]
      setWorkouts(updated)
      if (user) {
        localStorage.setItem(`gym-remo-workouts-${user.uid}`, JSON.stringify(updated))
      }
    }
  }

  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    const updated = workouts.map((w) => (w.id === id ? { ...w, ...updates } : w))
    setWorkouts(updated)
  }

  const deleteWorkout = async (id: string) => {
    try {
      await apiClient.delete(`/workouts/${id}`)
    } catch {
      // Continue with local deletion
    }
    const updated = workouts.filter((w) => w.id !== id)
    setWorkouts(updated)
  }

  const getWorkout = (id: string) => {
    return workouts.find((w) => w.id === id)
  }

  const getRecentWorkouts = (limit = 5) => {
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
  }

  const getWorkoutsByDateRange = (start: Date, end: Date) => {
    return workouts.filter((w) => {
      const date = new Date(w.date)
      return date >= start && date <= end
    })
  }

  const getPersonalRecords = () => {
    const records: Record<string, { weight: number; date: string }> = {}

    workouts.forEach((workout) => {
      workout.muscleGroups.forEach((mg) => {
        mg.exercises.forEach((exercise) => {
          const maxWeight = Math.max(...exercise.sets.map((s) => s.weight))
          const key = exercise.exerciseName

          if (!records[key] || records[key].weight < maxWeight) {
            records[key] = { weight: maxWeight, date: workout.date }
          }
        })
      })
    })

    return records
  }

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        loading,
        error,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getWorkout,
        getRecentWorkouts,
        getWorkoutsByDateRange,
        getPersonalRecords,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkouts() {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error("useWorkouts must be used within a WorkoutProvider")
  }
  return context
}

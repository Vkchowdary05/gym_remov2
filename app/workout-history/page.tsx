"use client"

import { useState, useMemo } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { useWorkouts } from "@/contexts/workout-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { muscleGroupLabels, type MuscleGroup } from "@/lib/exercises"
import { Search, Dumbbell, Calendar, ChevronRight, Plus } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function WorkoutHistoryPage() {
  return (
    <ProtectedLayout>
      <WorkoutHistoryContent />
    </ProtectedLayout>
  )
}

function WorkoutHistoryContent() {
  const { workouts, loading } = useWorkouts()
  const [searchQuery, setSearchQuery] = useState("")
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "all">("all")

  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter((workout) => {
        // Filter by muscle group
        if (muscleFilter !== "all") {
          const hasMuscleGroup = workout.muscleGroups.some((mg) => mg.muscleGroup === muscleFilter)
          if (!hasMuscleGroup) return false
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesMuscle = workout.muscleGroups.some((mg) =>
            muscleGroupLabels[mg.muscleGroup].toLowerCase().includes(query),
          )
          const matchesExercise = workout.muscleGroups.some((mg) =>
            mg.exercises.some((ex) => ex.exerciseName.toLowerCase().includes(query)),
          )
          const matchesDate = format(new Date(workout.date), "MMMM d yyyy").toLowerCase().includes(query)

          if (!matchesMuscle && !matchesExercise && !matchesDate) return false
        }

        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [workouts, searchQuery, muscleFilter])

  if (loading) {
    return <WorkoutHistorySkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Workout History</h1>
          <p className="text-muted-foreground mt-1">{workouts.length} total workouts</p>
        </div>
        <Link href="/add-workout">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Workout
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <Select value={muscleFilter} onValueChange={(v: MuscleGroup | "all") => setMuscleFilter(v)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background">
            <SelectValue placeholder="All muscle groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscle Groups</SelectItem>
            {(Object.keys(muscleGroupLabels) as MuscleGroup[]).map((mg) => (
              <SelectItem key={mg} value={mg}>
                {muscleGroupLabels[mg]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Workout List */}
      {filteredWorkouts.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Dumbbell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {workouts.length === 0 ? "No Workouts Yet" : "No Matching Workouts"}
              </h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                {workouts.length === 0
                  ? "Start tracking your fitness journey by adding your first workout."
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {workouts.length === 0 && (
                <Link href="/add-workout">
                  <Button>Add Your First Workout</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredWorkouts.map((workout) => (
            <Link key={workout.id} href={`/workout/${workout.id}`}>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {workout.muscleGroups.map((mg) => muscleGroupLabels[mg.muscleGroup]).join(", ")}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(workout.date), "EEEE, MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-card-foreground">{workout.totalSets} sets</p>
                        <p className="text-xs text-muted-foreground">{workout.totalVolume.toLocaleString()} kg</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function WorkoutHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

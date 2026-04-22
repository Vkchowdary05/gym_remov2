"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useWorkouts } from "@/contexts/workout-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts"
import { muscleGroupLabels, type MuscleGroup } from "@/lib/exercises"
import { TrendingUp, Calendar, Dumbbell, Target, Trophy } from "lucide-react"
import { format, subDays, subMonths, isAfter } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type DateRange = "7d" | "30d" | "90d" | "all"

const dateRangeLabels: Record<DateRange, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  all: "All Time",
}

export function ProgressContent() {
  const { workouts, loading, getPersonalRecords } = useWorkouts()
  const [selectedExercise, setSelectedExercise] = useState<string>("all")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | "all">("all")
  const [dateRange, setDateRange] = useState<DateRange>("30d")

  const personalRecords = getPersonalRecords()

  // Get unique exercises from workouts
  const workoutExercises = useMemo(() => {
    const exerciseSet = new Set<string>()
    workouts.forEach((workout) => {
      workout.muscleGroups.forEach((mg) => {
        mg.exercises.forEach((ex) => {
          exerciseSet.add(ex.exerciseName)
        })
      })
    })
    return Array.from(exerciseSet).sort()
  }, [workouts])

  // Filter workouts by date range
  const filteredWorkouts = useMemo(() => {
    const now = new Date()
    let cutoffDate: Date | null = null

    switch (dateRange) {
      case "7d":
        cutoffDate = subDays(now, 7)
        break
      case "30d":
        cutoffDate = subDays(now, 30)
        break
      case "90d":
        cutoffDate = subMonths(now, 3)
        break
      default:
        cutoffDate = null
    }

    return workouts
      .filter((w) => {
        if (!cutoffDate) return true
        return isAfter(new Date(w.date), cutoffDate)
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [workouts, dateRange])

  // Prepare chart data for weight progression
  const weightProgressData = useMemo(() => {
    if (selectedExercise === "all") return []

    const dataPoints: { date: string; weight: number; reps: number; volume: number }[] = []

    filteredWorkouts.forEach((workout) => {
      workout.muscleGroups.forEach((mg) => {
        mg.exercises.forEach((ex) => {
          if (ex.exerciseName === selectedExercise) {
            const maxWeight = Math.max(...ex.sets.map((s) => s.weight))
            const totalReps = ex.sets.reduce((sum, s) => sum + s.reps, 0)
            const volume = ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0)

            dataPoints.push({
              date: format(new Date(workout.date), "MMM d"),
              weight: maxWeight,
              reps: totalReps,
              volume,
            })
          }
        })
      })
    })

    return dataPoints
  }, [filteredWorkouts, selectedExercise])

  // Prepare volume over time data
  const volumeData = useMemo(() => {
    return filteredWorkouts.map((workout) => {
      let volume = 0

      workout.muscleGroups.forEach((mg) => {
        if (selectedMuscleGroup === "all" || mg.muscleGroup === selectedMuscleGroup) {
          mg.exercises.forEach((ex) => {
            volume += ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0)
          })
        }
      })

      return {
        date: format(new Date(workout.date), "MMM d"),
        volume,
      }
    })
  }, [filteredWorkouts, selectedMuscleGroup])

  // Prepare workout frequency data
  const frequencyData = useMemo(() => {
    const muscleGroupCounts: Record<string, number> = {}

    filteredWorkouts.forEach((workout) => {
      workout.muscleGroups.forEach((mg) => {
        const label = muscleGroupLabels[mg.muscleGroup]
        muscleGroupCounts[label] = (muscleGroupCounts[label] || 0) + 1
      })
    })

    return Object.entries(muscleGroupCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [filteredWorkouts])

  // Calculate summary stats
  const stats = useMemo(() => {
    let totalVolume = 0
    let totalSets = 0
    const totalWorkouts = filteredWorkouts.length

    filteredWorkouts.forEach((workout) => {
      totalVolume += workout.totalVolume
      totalSets += workout.totalSets
    })

    return {
      totalWorkouts,
      totalVolume,
      totalSets,
      avgVolumePerWorkout: totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0,
    }
  }, [filteredWorkouts])

  if (loading) {
    return <ProgressSkeleton />
  }

  const hasWorkouts = workouts.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Progress</h1>
          <p className="text-muted-foreground mt-1">Track your strength gains over time</p>
        </div>
        <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
          <SelectTrigger className="w-[180px] bg-background">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(dateRangeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hasWorkouts ? (
        <EmptyProgressState />
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={Dumbbell} label="Workouts" value={stats.totalWorkouts.toString()} />
            <StatsCard icon={Target} label="Total Sets" value={stats.totalSets.toString()} />
            <StatsCard icon={TrendingUp} label="Total Volume" value={`${(stats.totalVolume / 1000).toFixed(1)}t`} />
            <StatsCard icon={Trophy} label="Avg/Workout" value={`${stats.avgVolumePerWorkout.toLocaleString()}kg`} />
          </div>

          {/* Charts */}
          <Tabs defaultValue="exercise" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="exercise">By Exercise</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="frequency">Frequency</TabsTrigger>
            </TabsList>

            {/* Exercise Progress */}
            <TabsContent value="exercise" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-card-foreground">Exercise Progress</CardTitle>
                      <CardDescription>Track weight and rep progression for specific exercises</CardDescription>
                    </div>
                    <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                      <SelectTrigger className="w-[200px] bg-background">
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Select an exercise</SelectItem>
                        {workoutExercises.map((ex) => (
                          <SelectItem key={ex} value={ex}>
                            {ex}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedExercise === "all" ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Select an exercise to view progress
                    </div>
                  ) : weightProgressData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data for this exercise in the selected time range
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightProgressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--card-foreground))",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            name="Max Weight (kg)"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="volume"
                            name="Volume (kg)"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--secondary))" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PR for selected exercise */}
              {selectedExercise !== "all" && personalRecords[selectedExercise] && (
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Personal Record</p>
                        <p className="text-2xl font-bold text-card-foreground">
                          {personalRecords[selectedExercise].weight} kg
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Set on {format(new Date(personalRecords[selectedExercise].date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Volume Over Time */}
            <TabsContent value="volume" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-card-foreground">Volume Over Time</CardTitle>
                      <CardDescription>Total training volume per workout</CardDescription>
                    </div>
                    <Select
                      value={selectedMuscleGroup}
                      onValueChange={(v: MuscleGroup | "all") => setSelectedMuscleGroup(v)}
                    >
                      <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue />
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
                </CardHeader>
                <CardContent>
                  {volumeData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data in the selected time range
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={volumeData}>
                          <defs>
                            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--card-foreground))",
                            }}
                            formatter={(value: number) => [`${value.toLocaleString()} kg`, "Volume"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#volumeGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workout Frequency */}
            <TabsContent value="frequency" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Muscle Group Frequency</CardTitle>
                  <CardDescription>How often you train each muscle group</CardDescription>
                </CardHeader>
                <CardContent>
                  {frequencyData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data in the selected time range
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {frequencyData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-4">
                          <div className="w-24 text-sm font-medium text-card-foreground">{item.name}</div>
                          <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{
                                width: `${(item.count / Math.max(...frequencyData.map((d) => d.count))) * 100}%`,
                              }}
                            />
                          </div>
                          <Badge variant="secondary" className="min-w-[60px] justify-center">
                            {item.count} {item.count === 1 ? "time" : "times"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string
}

function StatsCard({ icon: Icon, label, value }: StatsCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-card-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyProgressState() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="py-16">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-muted p-6 mb-6">
            <TrendingUp className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2">No Progress Data Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Start logging your workouts to see your progress charts come to life. Track your strength gains, volume
            trends, and workout frequency over time.
          </p>
          <Link href="/add-workout">
            <Button size="lg">Add Your First Workout</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

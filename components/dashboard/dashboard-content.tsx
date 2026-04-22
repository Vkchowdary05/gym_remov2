"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useWorkouts } from "@/contexts/workout-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PlusCircle,
  TrendingUp,
  Calendar,
  Dumbbell,
  Trophy,
  Flame,
  Clock,
  ChevronRight,
  Target,
  Box,
} from "lucide-react"
import { format, differenceInDays, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"
import { muscleGroupLabels } from "@/lib/exercises"

export function DashboardContent() {
  const { user, profile } = useAuth()
  const { workouts, loading, getRecentWorkouts, getPersonalRecords } = useWorkouts()

  const recentWorkouts = getRecentWorkouts(5)
  const personalRecords = getPersonalRecords()

  // Calculate stats
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const workoutsThisWeek = workouts.filter((w) =>
    isWithinInterval(new Date(w.date), { start: weekStart, end: weekEnd }),
  )
  const totalWorkouts = workouts.length
  const lastWorkoutDate = recentWorkouts[0]?.date ? new Date(recentWorkouts[0].date) : null
  const daysSinceLastWorkout = lastWorkoutDate ? differenceInDays(now, lastWorkoutDate) : null

  // Calculate streak (consecutive days with workouts)
  const calculateStreak = () => {
    if (workouts.length === 0) return 0

    const sortedDates = [...new Set(workouts.map((w) => format(new Date(w.date), "yyyy-MM-dd")))].sort().reverse()

    let streak = 0
    let currentDate = new Date()

    for (const dateStr of sortedDates) {
      const workoutDate = new Date(dateStr)
      const dayDiff = differenceInDays(currentDate, workoutDate)

      if (dayDiff <= 1) {
        streak++
        currentDate = workoutDate
      } else {
        break
      }
    }

    return streak
  }

  const streak = calculateStreak()

  // Get top 3 PRs
  const topPRs = Object.entries(personalRecords)
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, 3)

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {profile?.name || user?.displayName || "Athlete"}!
          </h1>
          <p className="text-muted-foreground mt-1">Track your progress and crush your goals</p>
        </div>
        <Link href="/add-workout">
          <Button size="lg" className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Workout
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Dumbbell}
          label="This Week"
          value={workoutsThisWeek.length.toString()}
          subtitle="workouts"
          iconColor="text-primary"
        />
        <StatsCard
          icon={Flame}
          label="Current Streak"
          value={streak.toString()}
          subtitle={streak === 1 ? "day" : "days"}
          iconColor="text-destructive"
        />
        <StatsCard
          icon={Calendar}
          label="Total Workouts"
          value={totalWorkouts.toString()}
          subtitle="all time"
          iconColor="text-secondary"
        />
        <StatsCard
          icon={Clock}
          label="Last Workout"
          value={daysSinceLastWorkout !== null ? daysSinceLastWorkout.toString() : "-"}
          subtitle={daysSinceLastWorkout === 1 ? "day ago" : "days ago"}
          iconColor="text-accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Recent Workouts</CardTitle>
              <CardDescription>Your latest training sessions</CardDescription>
            </div>
            <Link href="/workout-history">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length === 0 ? (
              <EmptyState
                icon={Dumbbell}
                title="No workouts yet"
                description="Start tracking your fitness journey by adding your first workout"
                actionLabel="Add Your First Workout"
                actionHref="/add-workout"
              />
            ) : (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <Link key={workout.id} href={`/workout/${workout.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {workout.muscleGroups.map((mg) => muscleGroupLabels[mg.muscleGroup]).join(", ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(workout.date), "EEEE, MMM d")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground">{workout.totalSets} sets</p>
                        <p className="text-xs text-muted-foreground">
                          {workout.totalVolume.toLocaleString()} kg volume
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Records */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Trophy className="h-5 w-5 text-accent" />
              Personal Records
            </CardTitle>
            <CardDescription>Your top lifts</CardDescription>
          </CardHeader>
          <CardContent>
            {topPRs.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No PRs yet"
                description="Complete workouts to start tracking your personal records"
                compact
              />
            ) : (
              <div className="space-y-4">
                {topPRs.map(([exercise, record], index) => (
                  <div key={exercise} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? "bg-accent text-accent-foreground"
                            : index === 1
                              ? "bg-muted text-muted-foreground"
                              : "bg-secondary/50 text-secondary-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground text-sm">{exercise}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(record.date), "MMM d")}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-bold">
                      {record.weight} kg
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickActionCard
          href="/progress"
          icon={TrendingUp}
          title="View Progress"
          description="Track your strength gains"
          iconColor="text-secondary"
        />
        <QuickActionCard
          href="/3d-view"
          icon={Box}
          title="3D Muscle View"
          description="Visualize your strength"
          iconColor="text-primary"
        />
        <QuickActionCard
          href="/profile"
          icon={Target}
          title="Update Goals"
          description="Set new targets"
          iconColor="text-accent"
        />
      </div>
    </div>
  )
}

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string
  subtitle: string
  iconColor: string
}

function StatsCard({ icon: Icon, label, value, subtitle, iconColor }: StatsCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-card-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionCardProps {
  href: string
  icon: React.ElementType
  title: string
  description: string
  iconColor: string
}

function QuickActionCard({ href, icon: Icon, title, description, iconColor }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
              <p className="font-medium text-card-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  compact?: boolean
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, compact }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${compact ? "py-6" : "py-12"} text-center`}>
      <div className={`rounded-full bg-muted ${compact ? "p-2" : "p-4"} mb-4`}>
        <Icon className={`${compact ? "h-6 w-6" : "h-8 w-8"} text-muted-foreground`} />
      </div>
      <h3 className={`font-medium text-card-foreground ${compact ? "text-sm" : ""}`}>{title}</h3>
      <p className={`text-muted-foreground mt-1 max-w-sm ${compact ? "text-xs" : "text-sm"}`}>{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-4">
          <Button size={compact ? "sm" : "default"}>{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

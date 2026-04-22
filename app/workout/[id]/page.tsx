"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { useWorkouts } from "@/contexts/workout-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { muscleGroupLabels } from "@/lib/exercises"
import { ArrowLeft, Trash2, Calendar, Dumbbell, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  return (
    <ProtectedLayout>
      <WorkoutDetailContent id={resolvedParams.id} />
    </ProtectedLayout>
  )
}

function WorkoutDetailContent({ id }: { id: string }) {
  const { getWorkout, deleteWorkout } = useWorkouts()
  const router = useRouter()
  const { toast } = useToast()

  const workout = getWorkout(id)

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Workout Not Found</h2>
        <p className="text-muted-foreground mb-6">This workout doesn't exist or has been deleted.</p>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteWorkout(id)
    toast({
      title: "Workout deleted",
      description: "The workout has been removed from your history.",
    })
    router.push("/workout-history")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-transparent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Workout Details</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(workout.date), "EEEE, MMMM d, yyyy")}</span>
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workout?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this workout from your history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-card-foreground">{workout.muscleGroups.length}</div>
            <p className="text-sm text-muted-foreground">Muscle Groups</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-card-foreground">{workout.totalSets}</div>
            <p className="text-sm text-muted-foreground">Total Sets</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-card-foreground">{workout.totalVolume.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Volume (kg)</p>
          </CardContent>
        </Card>
      </div>

      {/* Exercises by Muscle Group */}
      {workout.muscleGroups.map((mg, mgIndex) => (
        <Card key={mgIndex} className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-card-foreground">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              {muscleGroupLabels[mg.muscleGroup]}
              <Badge variant="secondary">{mg.exercises.length} exercises</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mg.exercises.map((exercise, exIndex) => {
              const maxWeight = Math.max(...exercise.sets.map((s) => s.weight))
              const totalVolume = exercise.sets.reduce((sum, s) => sum + s.weight * s.reps, 0)

              return (
                <div key={exIndex} className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-card-foreground">{exercise.exerciseName}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Max: {maxWeight}kg</span>
                    </div>
                  </div>

                  {/* Sets Table */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground font-medium px-2">
                      <span>Set</span>
                      <span>Weight</span>
                      <span>Reps</span>
                    </div>
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-3 gap-4 text-sm py-2 px-2 rounded bg-background/50">
                        <span className="text-muted-foreground">{setIndex + 1}</span>
                        <span className="text-card-foreground font-medium">{set.weight} kg</span>
                        <span className="text-card-foreground">{set.reps} reps</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Volume</span>
                    <span className="font-medium text-card-foreground">{totalVolume.toLocaleString()} kg</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

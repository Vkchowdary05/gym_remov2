"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkouts, type MuscleGroup, type MuscleGroupEntry } from "@/contexts/workout-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getExercisesByMuscleGroup, muscleGroupLabels, type Exercise } from "@/lib/exercises"
import { Plus, Trash2, Dumbbell, ChevronDown, ChevronUp, Loader2, Check } from "lucide-react"
import { format } from "date-fns"

interface WorkoutSet {
  weight: number
  reps: number
}

interface ExerciseData {
  exerciseId: string
  exerciseName: string
  sets: WorkoutSet[]
}

interface MuscleGroupData {
  muscleGroup: MuscleGroup
  exercises: ExerciseData[]
}

const allMuscleGroups: MuscleGroup[] = ["chest", "back", "shoulders", "biceps", "triceps", "legs", "forearms", "cardio"]

export function AddWorkoutContent() {
  const { addWorkout } = useWorkouts()
  const router = useRouter()
  const { toast } = useToast()

  const [workoutDate, setWorkoutDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]))

  const usedMuscleGroups = new Set(muscleGroups.map((mg) => mg.muscleGroup))
  const availableMuscleGroups = allMuscleGroups.filter((mg) => !usedMuscleGroups.has(mg))

  const addMuscleGroup = (muscleGroup: MuscleGroup) => {
    setMuscleGroups((prev) => [...prev, { muscleGroup, exercises: [] }])
    setExpandedGroups((prev) => new Set([...prev, muscleGroups.length]))
  }

  const removeMuscleGroup = (index: number) => {
    setMuscleGroups((prev) => prev.filter((_, i) => i !== index))
    setExpandedGroups((prev) => {
      const updated = new Set(prev)
      updated.delete(index)
      return updated
    })
  }

  const toggleGroupExpanded = (index: number) => {
    setExpandedGroups((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) {
        updated.delete(index)
      } else {
        updated.add(index)
      }
      return updated
    })
  }

  const addExercise = (groupIndex: number, exercise: Exercise) => {
    setMuscleGroups((prev) =>
      prev.map((mg, i) => {
        if (i === groupIndex) {
          return {
            ...mg,
            exercises: [
              ...mg.exercises,
              {
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                sets: [{ weight: 0, reps: 0 }],
              },
            ],
          }
        }
        return mg
      }),
    )
  }

  const removeExercise = (groupIndex: number, exerciseIndex: number) => {
    setMuscleGroups((prev) =>
      prev.map((mg, i) => {
        if (i === groupIndex) {
          return {
            ...mg,
            exercises: mg.exercises.filter((_, j) => j !== exerciseIndex),
          }
        }
        return mg
      }),
    )
  }

  const addSet = (groupIndex: number, exerciseIndex: number) => {
    setMuscleGroups((prev) =>
      prev.map((mg, i) => {
        if (i === groupIndex) {
          return {
            ...mg,
            exercises: mg.exercises.map((ex, j) => {
              if (j === exerciseIndex) {
                const lastSet = ex.sets[ex.sets.length - 1]
                return {
                  ...ex,
                  sets: [...ex.sets, { weight: lastSet?.weight || 0, reps: lastSet?.reps || 0 }],
                }
              }
              return ex
            }),
          }
        }
        return mg
      }),
    )
  }

  const removeSet = (groupIndex: number, exerciseIndex: number, setIndex: number) => {
    setMuscleGroups((prev) =>
      prev.map((mg, i) => {
        if (i === groupIndex) {
          return {
            ...mg,
            exercises: mg.exercises.map((ex, j) => {
              if (j === exerciseIndex && ex.sets.length > 1) {
                return {
                  ...ex,
                  sets: ex.sets.filter((_, k) => k !== setIndex),
                }
              }
              return ex
            }),
          }
        }
        return mg
      }),
    )
  }

  const updateSet = (
    groupIndex: number,
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: number,
  ) => {
    setMuscleGroups((prev) =>
      prev.map((mg, i) => {
        if (i === groupIndex) {
          return {
            ...mg,
            exercises: mg.exercises.map((ex, j) => {
              if (j === exerciseIndex) {
                return {
                  ...ex,
                  sets: ex.sets.map((set, k) => {
                    if (k === setIndex) {
                      return { ...set, [field]: value }
                    }
                    return set
                  }),
                }
              }
              return ex
            }),
          }
        }
        return mg
      }),
    )
  }

  const calculateTotals = () => {
    let totalSets = 0
    let totalVolume = 0

    muscleGroups.forEach((mg) => {
      mg.exercises.forEach((ex) => {
        totalSets += ex.sets.length
        ex.sets.forEach((set) => {
          totalVolume += set.weight * set.reps
        })
      })
    })

    return { totalSets, totalVolume }
  }

  const handleSubmit = async () => {
    if (muscleGroups.length === 0) {
      toast({
        title: "No exercises added",
        description: "Please add at least one muscle group and exercise",
        variant: "destructive",
      })
      return
    }

    const hasEmptyExercises = muscleGroups.some((mg) => mg.exercises.length === 0)
    if (hasEmptyExercises) {
      toast({
        title: "Incomplete workout",
        description: "Each muscle group must have at least one exercise",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { totalSets, totalVolume } = calculateTotals()

      const workoutData: MuscleGroupEntry[] = muscleGroups.map((mg) => ({
        muscleGroup: mg.muscleGroup,
        exercises: mg.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets,
        })),
      }))

      await addWorkout({
        date: new Date(workoutDate).toISOString(),
        muscleGroups: workoutData,
        totalSets,
        totalVolume,
      })

      setShowSuccessDialog(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const { totalSets, totalVolume } = calculateTotals()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Add Workout</h1>
        <p className="text-muted-foreground mt-1">Log your training session</p>
      </div>

      {/* Date Selector */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="workout-date" className="text-foreground whitespace-nowrap">
              Workout Date
            </Label>
            <Input
              id="workout-date"
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              className="bg-background max-w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Muscle Groups */}
      {muscleGroups.map((mg, groupIndex) => (
        <MuscleGroupCard
          key={`${mg.muscleGroup}-${groupIndex}`}
          data={mg}
          groupIndex={groupIndex}
          isExpanded={expandedGroups.has(groupIndex)}
          onToggleExpand={() => toggleGroupExpanded(groupIndex)}
          onRemove={() => removeMuscleGroup(groupIndex)}
          onAddExercise={(exercise) => addExercise(groupIndex, exercise)}
          onRemoveExercise={(exerciseIndex) => removeExercise(groupIndex, exerciseIndex)}
          onAddSet={(exerciseIndex) => addSet(groupIndex, exerciseIndex)}
          onRemoveSet={(exerciseIndex, setIndex) => removeSet(groupIndex, exerciseIndex, setIndex)}
          onUpdateSet={(exerciseIndex, setIndex, field, value) =>
            updateSet(groupIndex, exerciseIndex, setIndex, field, value)
          }
        />
      ))}

      {/* Add Muscle Group */}
      {availableMuscleGroups.length > 0 && (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Label className="text-foreground whitespace-nowrap">Add Muscle Group</Label>
              <Select onValueChange={(value: MuscleGroup) => addMuscleGroup(value)}>
                <SelectTrigger className="bg-background flex-1">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {availableMuscleGroups.map((mg) => (
                    <SelectItem key={mg} value={mg}>
                      {muscleGroupLabels[mg]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary & Submit */}
      {muscleGroups.length > 0 && (
        <Card className="bg-card border-border sticky bottom-4">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Sets:</span>{" "}
                  <span className="font-bold text-card-foreground">{totalSets}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Volume:</span>{" "}
                  <span className="font-bold text-card-foreground">{totalVolume.toLocaleString()} kg</span>
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Workout
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-secondary" />
              </div>
              Workout Saved!
            </DialogTitle>
            <DialogDescription>Your workout has been recorded successfully.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false)
                setMuscleGroups([])
              }}
              className="flex-1 bg-transparent"
            >
              Add Another
            </Button>
            <Button onClick={() => router.push("/dashboard")} className="flex-1">
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MuscleGroupCardProps {
  data: MuscleGroupData
  groupIndex: number
  isExpanded: boolean
  onToggleExpand: () => void
  onRemove: () => void
  onAddExercise: (exercise: Exercise) => void
  onRemoveExercise: (exerciseIndex: number) => void
  onAddSet: (exerciseIndex: number) => void
  onRemoveSet: (exerciseIndex: number, setIndex: number) => void
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: "weight" | "reps", value: number) => void
}

function MuscleGroupCard({
  data,
  groupIndex,
  isExpanded,
  onToggleExpand,
  onRemove,
  onAddExercise,
  onRemoveExercise,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
}: MuscleGroupCardProps) {
  const availableExercises = getExercisesByMuscleGroup(data.muscleGroup)
  const usedExerciseIds = new Set(data.exercises.map((ex) => ex.exerciseId))
  const remainingExercises = availableExercises.filter((ex) => !usedExerciseIds.has(ex.id))

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{muscleGroupLabels[data.muscleGroup]}</h3>
            <p className="text-sm text-muted-foreground">
              {data.exercises.length} exercise{data.exercises.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Exercises */}
          {data.exercises.map((exercise, exerciseIndex) => (
            <ExerciseCard
              key={`${exercise.exerciseId}-${exerciseIndex}`}
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              onRemove={() => onRemoveExercise(exerciseIndex)}
              onAddSet={() => onAddSet(exerciseIndex)}
              onRemoveSet={(setIndex) => onRemoveSet(exerciseIndex, setIndex)}
              onUpdateSet={(setIndex, field, value) => onUpdateSet(exerciseIndex, setIndex, field, value)}
            />
          ))}

          {/* Add Exercise */}
          {remainingExercises.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <Select
                onValueChange={(value) => {
                  const exercise = availableExercises.find((ex) => ex.id === value)
                  if (exercise) onAddExercise(exercise)
                }}
              >
                <SelectTrigger className="bg-background flex-1">
                  <SelectValue placeholder="Add exercise..." />
                </SelectTrigger>
                <SelectContent>
                  {remainingExercises.map((ex) => (
                    <SelectItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

interface ExerciseCardProps {
  exercise: ExerciseData
  exerciseIndex: number
  onRemove: () => void
  onAddSet: () => void
  onRemoveSet: (setIndex: number) => void
  onUpdateSet: (setIndex: number, field: "weight" | "reps", value: number) => void
}

function ExerciseCard({ exercise, exerciseIndex, onRemove, onAddSet, onRemoveSet, onUpdateSet }: ExerciseCardProps) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 space-y-3">
      {/* Exercise Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-card-foreground">{exercise.exerciseName}</h4>
        <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive h-8">
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Sets */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 text-xs text-muted-foreground px-1">
          <span>Set</span>
          <span>Weight (kg)</span>
          <span>Reps</span>
          <span></span>
        </div>

        {/* Set Rows */}
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 items-center">
            <span className="text-sm font-medium text-center text-muted-foreground">{setIndex + 1}</span>
            <Input
              type="number"
              min={0}
              step={0.5}
              value={set.weight || ""}
              onChange={(e) => onUpdateSet(setIndex, "weight", Number(e.target.value))}
              className="bg-background h-9"
              placeholder="0"
            />
            <Input
              type="number"
              min={0}
              value={set.reps || ""}
              onChange={(e) => onUpdateSet(setIndex, "reps", Number(e.target.value))}
              className="bg-background h-9"
              placeholder="0"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveSet(setIndex)}
              disabled={exercise.sets.length <= 1}
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Set Button */}
      <Button variant="outline" size="sm" onClick={onAddSet} className="w-full bg-transparent">
        <Plus className="h-3 w-3 mr-1" />
        Add Set
      </Button>
    </div>
  )
}

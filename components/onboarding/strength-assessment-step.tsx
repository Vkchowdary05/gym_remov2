"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

interface StrengthData {
  benchPress: number
  squat: number
  deadlift: number
  shoulderPress: number
  barbellRow: number
  overheadPress: number
  legPress: number
  pullUps: number
}

interface StrengthAssessmentStepProps {
  data: StrengthData
  onUpdate: (updates: Partial<StrengthData>) => void
}

const exercises = [
  { key: "benchPress" as const, label: "Bench Press", unit: "kg" },
  { key: "squat" as const, label: "Squat", unit: "kg" },
  { key: "deadlift" as const, label: "Deadlift", unit: "kg" },
  { key: "shoulderPress" as const, label: "Shoulder Press", unit: "kg" },
  { key: "barbellRow" as const, label: "Barbell Row", unit: "kg" },
  { key: "overheadPress" as const, label: "Overhead Press", unit: "kg" },
  { key: "legPress" as const, label: "Leg Press", unit: "kg" },
  {
    key: "pullUps" as const,
    label: "Pull-ups",
    unit: "× BW",
    description: "Bodyweight multiplier (e.g., 1.0 = bodyweight)",
  },
]

export function StrengthAssessmentStep({ data, onUpdate }: StrengthAssessmentStepProps) {
  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-card-foreground font-medium">Enter your 1-rep max or best weight</p>
              <p className="text-sm text-muted-foreground mt-1">
                These help us assess your current strength level. Be honest - no judgment! Leave at 0 if you haven't
                tried an exercise yet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exercises.map((exercise) => (
          <div key={exercise.key} className="space-y-2">
            <Label htmlFor={exercise.key} className="text-foreground flex items-center gap-2">
              {exercise.label}
              <span className="text-xs text-muted-foreground">({exercise.unit})</span>
            </Label>
            <Input
              id={exercise.key}
              type="number"
              min={0}
              max={exercise.key === "pullUps" ? 3 : 500}
              step={exercise.key === "pullUps" ? 0.1 : 1}
              value={data[exercise.key]}
              onChange={(e) => onUpdate({ [exercise.key]: Number(e.target.value) })}
              className="bg-background"
            />
            {exercise.description && <p className="text-xs text-muted-foreground">{exercise.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

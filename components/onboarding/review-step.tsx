"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2 } from "lucide-react"
import { calculateStrengthLevel, strengthLevelLabels, getOverallStrengthLevel } from "@/lib/strength-calculator"

interface ReviewData {
  name: string
  gender: "male" | "female" | "other"
  weight: number
  height: number
  benchPress: number
  squat: number
  deadlift: number
  shoulderPress: number
  barbellRow: number
  overheadPress: number
  legPress: number
  pullUps: number
}

interface ReviewStepProps {
  data: ReviewData
  onEdit: (step: number) => void
}

const genderLabels = {
  male: "Male",
  female: "Female",
  other: "Other",
}

const exerciseLabels = {
  benchPress: "Bench Press",
  squat: "Squat",
  deadlift: "Deadlift",
  shoulderPress: "Shoulder Press",
  barbellRow: "Barbell Row",
  overheadPress: "Overhead Press",
  legPress: "Leg Press",
  pullUps: "Pull-ups",
}

export function ReviewStep({ data, onEdit }: ReviewStepProps) {
  const strengthAssessment = {
    benchPress: data.benchPress,
    squat: data.squat,
    deadlift: data.deadlift,
    shoulderPress: data.shoulderPress,
    barbellRow: data.barbellRow,
    overheadPress: data.overheadPress,
    legPress: data.legPress,
    pullUps: data.pullUps * data.weight, // Convert multiplier to actual weight for calculation
  }

  const overallLevel = getOverallStrengthLevel(strengthAssessment, data.weight)

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-card-foreground">Personal Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium text-card-foreground">{data.name || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Gender</dt>
              <dd className="font-medium text-card-foreground">{genderLabels[data.gender]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Weight</dt>
              <dd className="font-medium text-card-foreground">{data.weight} kg</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Height</dt>
              <dd className="font-medium text-card-foreground">{data.height} cm</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Strength Assessment */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-semibold text-card-foreground">Strength Assessment</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {strengthLevelLabels[overallLevel]}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(strengthAssessment).map(([key, value]) => {
              const isPullUps = key === "pullUps"
              const displayValue = isPullUps ? data.pullUps : value
              const level =
                value > 0 ? calculateStrengthLevel(key as keyof typeof strengthAssessment, value, data.weight) : null

              return (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <dt className="text-muted-foreground">{exerciseLabels[key as keyof typeof exerciseLabels]}</dt>
                    <dd className="font-medium text-card-foreground">
                      {displayValue} {isPullUps ? "× BW" : "kg"}
                    </dd>
                  </div>
                  {level && (
                    <Badge variant="outline" className="text-xs">
                      {strengthLevelLabels[level]}
                    </Badge>
                  )}
                </div>
              )
            })}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

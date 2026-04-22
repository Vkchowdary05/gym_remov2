"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Dumbbell, FileText, Clock, Zap, Plus, Play, ChevronRight, Target, Flame } from "lucide-react"

interface WorkoutTemplate {
  id: string
  name: string
  description: string
  category: string
  muscleGroups: string[]
  estimatedDuration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  exercises: { name: string; sets: number; reps: string }[]
}

const systemTemplates: WorkoutTemplate[] = [
  {
    id: "ppl-push",
    name: "Push Day",
    description: "Chest, shoulders, and triceps focused session",
    category: "Push Pull Legs",
    muscleGroups: ["Chest", "Shoulders", "Triceps"],
    estimatedDuration: "60-75 min",
    difficulty: "intermediate",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "6-8" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "8-10" },
      { name: "Overhead Press", sets: 3, reps: "8-10" },
      { name: "Lateral Raises", sets: 3, reps: "12-15" },
      { name: "Tricep Pushdown", sets: 3, reps: "10-12" },
      { name: "Overhead Extension", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ppl-pull",
    name: "Pull Day",
    description: "Back and biceps focused session",
    category: "Push Pull Legs",
    muscleGroups: ["Back", "Biceps", "Forearms"],
    estimatedDuration: "60-75 min",
    difficulty: "intermediate",
    exercises: [
      { name: "Deadlift", sets: 3, reps: "5" },
      { name: "Barbell Row", sets: 4, reps: "6-8" },
      { name: "Lat Pulldown", sets: 3, reps: "8-10" },
      { name: "Seated Cable Row", sets: 3, reps: "10-12" },
      { name: "Barbell Curl", sets: 3, reps: "8-10" },
      { name: "Hammer Curl", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "ppl-legs",
    name: "Leg Day",
    description: "Complete lower body workout",
    category: "Push Pull Legs",
    muscleGroups: ["Legs", "Glutes", "Calves"],
    estimatedDuration: "60-75 min",
    difficulty: "intermediate",
    exercises: [
      { name: "Squat", sets: 4, reps: "6-8" },
      { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
      { name: "Leg Press", sets: 3, reps: "10-12" },
      { name: "Leg Curl", sets: 3, reps: "10-12" },
      { name: "Hip Thrust", sets: 3, reps: "10-12" },
      { name: "Standing Calf Raise", sets: 4, reps: "12-15" },
    ],
  },
  {
    id: "upper-lower-upper",
    name: "Upper Body",
    description: "Balanced upper body push and pull",
    category: "Upper Lower",
    muscleGroups: ["Chest", "Back", "Shoulders", "Arms"],
    estimatedDuration: "60-70 min",
    difficulty: "intermediate",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "6-8" },
      { name: "Barbell Row", sets: 4, reps: "6-8" },
      { name: "Shoulder Press", sets: 3, reps: "8-10" },
      { name: "Lat Pulldown", sets: 3, reps: "10-12" },
      { name: "Dumbbell Curl", sets: 3, reps: "10-12" },
      { name: "Skull Crushers", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "upper-lower-lower",
    name: "Lower Body",
    description: "Quads, hamstrings, glutes, and calves",
    category: "Upper Lower",
    muscleGroups: ["Legs", "Glutes", "Core"],
    estimatedDuration: "55-65 min",
    difficulty: "intermediate",
    exercises: [
      { name: "Squat", sets: 4, reps: "6-8" },
      { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "10-12" },
      { name: "Leg Extension", sets: 3, reps: "12-15" },
      { name: "Leg Curl", sets: 3, reps: "10-12" },
      { name: "Plank", sets: 3, reps: "60 sec" },
    ],
  },
  {
    id: "full-body-beginner",
    name: "Full Body (Beginner)",
    description: "Simple full body routine for newcomers",
    category: "Full Body",
    muscleGroups: ["Full Body"],
    estimatedDuration: "45-55 min",
    difficulty: "beginner",
    exercises: [
      { name: "Goblet Squat", sets: 3, reps: "10-12" },
      { name: "Machine Chest Press", sets: 3, reps: "10-12" },
      { name: "Lat Pulldown", sets: 3, reps: "10-12" },
      { name: "Shoulder Press", sets: 3, reps: "10-12" },
      { name: "Leg Curl", sets: 3, reps: "12-15" },
      { name: "Plank", sets: 3, reps: "30 sec" },
    ],
  },
  {
    id: "strength-5x5",
    name: "5x5 Strength",
    description: "Classic 5x5 strength building program",
    category: "Strength",
    muscleGroups: ["Full Body"],
    estimatedDuration: "50-60 min",
    difficulty: "advanced",
    exercises: [
      { name: "Squat", sets: 5, reps: "5" },
      { name: "Bench Press", sets: 5, reps: "5" },
      { name: "Barbell Row", sets: 5, reps: "5" },
    ],
  },
  {
    id: "hiit-circuit",
    name: "HIIT Circuit",
    description: "High intensity metabolic conditioning",
    category: "Cardio",
    muscleGroups: ["Full Body", "Cardio"],
    estimatedDuration: "30-40 min",
    difficulty: "advanced",
    exercises: [
      { name: "Box Jump", sets: 4, reps: "15" },
      { name: "Push-ups", sets: 4, reps: "15" },
      { name: "Jump Rope", sets: 4, reps: "60 sec" },
      { name: "Russian Twist", sets: 4, reps: "20" },
      { name: "Battle Ropes", sets: 4, reps: "30 sec" },
    ],
  },
]

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/30",
  intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  advanced: "bg-red-500/10 text-red-500 border-red-500/30",
}

const categoryIcons: Record<string, typeof Dumbbell> = {
  "Push Pull Legs": Dumbbell,
  "Upper Lower": Target,
  "Full Body": Zap,
  Strength: Flame,
  Cardio: Zap,
}

export default function TemplatesPage() {
  return (
    <ProtectedLayout>
      <TemplatesContent />
    </ProtectedLayout>
  )
}

function TemplatesContent() {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)

  const categories = [...new Set(systemTemplates.map((t) => t.category))]

  const filteredTemplates =
    selectedCategory === "all"
      ? systemTemplates
      : systemTemplates.filter((t) => t.category === selectedCategory)

  const handleUseTemplate = (template: WorkoutTemplate) => {
    toast({
      title: `Template: ${template.name}`,
      description: "Navigate to Add Workout to use this template. Template pre-fill coming soon!",
    })
    router.push("/add-workout")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Workout Templates</h1>
          <p className="text-muted-foreground mt-1">
            Pre-built workout plans to get you started
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className={selectedCategory !== "all" ? "bg-transparent" : ""}
        >
          All Templates
        </Button>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat] || FileText
          return (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory !== cat ? "bg-transparent" : ""}
            >
              <Icon className="h-4 w-4 mr-1" />
              {cat}
            </Button>
          )
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isExpanded={expandedTemplate === template.id}
            onToggle={() =>
              setExpandedTemplate(expandedTemplate === template.id ? null : template.id)
            }
            onUse={() => handleUseTemplate(template)}
          />
        ))}
      </div>
    </div>
  )
}

function TemplateCard({
  template,
  isExpanded,
  onToggle,
  onUse,
}: {
  template: WorkoutTemplate
  isExpanded: boolean
  onToggle: () => void
  onUse: () => void
}) {
  const Icon = categoryIcons[template.category] || FileText

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-card-foreground">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </div>
          </div>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {template.estimatedDuration}
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs capitalize ${difficultyColors[template.difficulty]}`}
          >
            {template.difficulty}
          </Badge>
          {template.muscleGroups.map((mg) => (
            <Badge key={mg} variant="outline" className="text-xs">
              {mg}
            </Badge>
          ))}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Exercise List */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Exercises
            </p>
            {template.exercises.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{ex.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {ex.sets} × {ex.reps}
                </span>
              </div>
            ))}
          </div>

          {/* Use Template Button */}
          <Button onClick={onUse} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start This Workout
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

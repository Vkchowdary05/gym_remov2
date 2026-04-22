"use client"

import { useState, useMemo } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { exercises, muscleGroupLabels, type MuscleGroup, type Exercise } from "@/lib/exercises"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Dumbbell, Filter, Zap, Star } from "lucide-react"

export default function ExercisesPage() {
  return (
    <ProtectedLayout>
      <ExercisesContent />
    </ProtectedLayout>
  )
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/30",
  intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  advanced: "bg-red-500/10 text-red-500 border-red-500/30",
}

function ExercisesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "all">("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all")

  // Get unique equipment types
  const equipmentTypes = useMemo(() => {
    const types = new Set(exercises.map((e) => e.equipment).filter(Boolean))
    return Array.from(types).sort() as string[]
  }, [])

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      if (muscleFilter !== "all" && exercise.muscleGroup !== muscleFilter) return false
      if (difficultyFilter !== "all" && exercise.difficulty !== difficultyFilter) return false
      if (equipmentFilter !== "all" && exercise.equipment !== equipmentFilter) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          exercise.name.toLowerCase().includes(query) ||
          exercise.muscleGroup.toLowerCase().includes(query) ||
          (exercise.equipment && exercise.equipment.toLowerCase().includes(query))
        )
      }
      return true
    })
  }, [searchQuery, muscleFilter, difficultyFilter, equipmentFilter])

  // Group by muscle group
  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {}
    filteredExercises.forEach((ex) => {
      const key = ex.muscleGroup
      if (!groups[key]) groups[key] = []
      groups[key].push(ex)
    })
    return groups
  }, [filteredExercises])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Exercise Library</h1>
        <p className="text-muted-foreground mt-1">
          Browse {exercises.length} exercises across {Object.keys(muscleGroupLabels).length} muscle groups
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select value={muscleFilter} onValueChange={(v: MuscleGroup | "all") => setMuscleFilter(v)}>
              <SelectTrigger className="w-full md:w-[180px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Muscle Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Muscles</SelectItem>
                {(Object.keys(muscleGroupLabels) as MuscleGroup[]).map((mg) => (
                  <SelectItem key={mg} value={mg}>
                    {muscleGroupLabels[mg]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full md:w-[160px] bg-background">
                <Zap className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-background">
                <Dumbbell className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                {equipmentTypes.map((eq) => (
                  <SelectItem key={eq} value={eq}>
                    {eq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredExercises.length} of {exercises.length} exercises
      </p>

      {/* Exercise Grid */}
      {Object.keys(groupedExercises).length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No Exercises Found</h3>
              <p className="text-muted-foreground max-w-sm">
                Try adjusting your search or filters to find exercises.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedExercises).map(([muscleGroup, exList]) => (
            <div key={muscleGroup}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {muscleGroupLabels[muscleGroup as MuscleGroup]}
                </h2>
                <Badge variant="secondary">{exList.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exList.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-card-foreground leading-tight">{exercise.name}</h3>
            {exercise.isCompound && (
              <Badge variant="outline" className="text-xs shrink-0 ml-2">
                <Star className="h-3 w-3 mr-1" />
                Compound
              </Badge>
            )}
          </div>
          {exercise.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {exercise.difficulty && (
              <Badge
                variant="outline"
                className={`text-xs capitalize ${difficultyColors[exercise.difficulty] || ""}`}
              >
                {exercise.difficulty}
              </Badge>
            )}
            {exercise.equipment && (
              <Badge variant="secondary" className="text-xs">
                {exercise.equipment}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

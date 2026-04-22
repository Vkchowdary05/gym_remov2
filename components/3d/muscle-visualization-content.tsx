"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { strengthLevelLabels, strengthLevelColors, type StrengthLevel } from "@/lib/strength-calculator"
import { calculateAllMuscleColors, getMuscleExerciseMapping } from "@/lib/muscle-color-calculator"
import { RotateCcw, Eye, Dumbbell, User, Info, Keyboard } from "lucide-react"

const MuscleModel3D = dynamic(() => import("./muscle-model-3d").then((mod) => mod.MuscleModel3D), {
  ssr: false,
  loading: () => <Model3DSkeleton />,
})

interface MuscleInfo {
  name: string
  displayName: string
  level: StrengthLevel
  exercise: string
  maxLift: number
}

export function MuscleVisualization3DContent() {
  const { profile, strengthAssessment } = useAuth()
  const [viewSide, setViewSide] = useState<"front" | "back">("front")
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleInfo | null>(null)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [showLegend, setShowLegend] = useState(true)
  const [showHint, setShowHint] = useState(true)

  const bodyWeight = profile?.weight || 70
  const gender = (profile?.gender as "male" | "female" | "other") || "male"

  // Calculate ALL muscle colors based on the complete formula
  const muscleStrengths = calculateAllMuscleColors(strengthAssessment, bodyWeight, gender)

  // Hide hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "f":
          setViewSide((prev) => (prev === "front" ? "back" : "front"))
          break
        case "r":
          setResetTrigger((prev) => prev + 1)
          break
        case "l":
          setShowLegend((prev) => !prev)
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleMuscleHover = useCallback(
    (muscle: string | null) => {
      if (!muscle) {
        setHoveredMuscle(null)
        return
      }

      const mapping = getMuscleExerciseMapping(muscle)
      const exerciseKey = mapping.exercise as keyof typeof strengthAssessment
      const maxLift = strengthAssessment?.[exerciseKey] || 0

      // Format muscle name for display
      const displayName = muscle
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      setHoveredMuscle({
        name: muscle,
        displayName,
        level: muscleStrengths[muscle] || "average",
        exercise: mapping.displayName,
        maxLift,
      })
    },
    [strengthAssessment, muscleStrengths],
  )

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[600px] bg-black overflow-hidden">
      {/* 3D Canvas - Full viewport */}
      <div className="absolute inset-0">
        <Suspense fallback={<Model3DSkeleton />}>
          <MuscleModel3D
            muscleStrengths={muscleStrengths}
            viewSide={viewSide}
            onMuscleHover={handleMuscleHover}
            resetTrigger={resetTrigger}
            gender={gender}
          />
        </Suspense>
      </div>

      {/* Top Left - User Stats */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/20 p-3">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <User className="w-4 h-4" />
            <span className="font-medium">Your Stats</span>
          </div>
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex justify-between gap-4">
              <span>Gender</span>
              <span className="text-white capitalize">{gender}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Weight</span>
              <span className="text-white">{bodyWeight} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right - View Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewSide((prev) => (prev === "front" ? "back" : "front"))}
          className="bg-black/70 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
        >
          <Eye className="mr-2 h-4 w-4" />
          {viewSide === "front" ? "Back" : "Front"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setResetTrigger((prev) => prev + 1)}
          className="bg-black/70 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Bottom Left - Muscle Info on Hover */}
      {hoveredMuscle && (
        <div className="absolute bottom-20 left-4 z-10 animate-in fade-in slide-in-from-left-2 duration-200">
          <div className="bg-black/80 backdrop-blur-md rounded-lg border border-white/20 p-4 max-w-xs">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${strengthLevelColors[hoveredMuscle.level]}30` }}
              >
                <Dumbbell className="w-5 h-5" style={{ color: strengthLevelColors[hoveredMuscle.level] }} />
              </div>
              <div>
                <p className="font-semibold text-white text-lg">{hoveredMuscle.displayName}</p>
                <p className="text-sm text-white/60">
                  {hoveredMuscle.exercise}: <span className="text-white">{hoveredMuscle.maxLift} kg</span>
                </p>
                <Badge
                  className="mt-2"
                  style={{
                    backgroundColor: `${strengthLevelColors[hoveredMuscle.level]}20`,
                    color: strengthLevelColors[hoveredMuscle.level],
                    borderColor: strengthLevelColors[hoveredMuscle.level],
                  }}
                >
                  {strengthLevelLabels[hoveredMuscle.level]}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right - Color Legend */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/20 p-3">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <Info className="w-4 h-4" />
              <span className="font-medium">Strength Legend</span>
            </div>
            <div className="space-y-1.5">
              {(["poor", "average", "good", "excellent", "bodybuilder"] as StrengthLevel[]).map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{
                      backgroundColor: strengthLevelColors[level],
                      boxShadow: `0 0 8px ${strengthLevelColors[level]}50`,
                    }}
                  />
                  <span className="text-xs text-white/80">{strengthLevelLabels[level]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Center Bottom - Instructions (fades out) */}
      {showHint && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-in fade-in duration-500">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <p className="text-xs text-white/50">Drag to rotate • Scroll to zoom • Hover muscles for details</p>
          </div>
        </div>
      )}

      {/* Bottom Left Corner - Keyboard Shortcuts */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:block">
        {!hoveredMuscle && (
          <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-2">
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <Keyboard className="w-3 h-3 mr-1" />
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">F</kbd>
              <span>Flip</span>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] ml-2">R</kbd>
              <span>Reset</span>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] ml-2">L</kbd>
              <span>Legend</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Model3DSkeleton() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-black">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white/50">Loading 3D anatomy model...</p>
      </div>
    </div>
  )
}

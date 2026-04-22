"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { MuscleVisualization3DContent } from "@/components/3d/muscle-visualization-content"

export default function MuscleVisualization3DPage() {
  return (
    <ProtectedLayout>
      <MuscleVisualization3DContent />
    </ProtectedLayout>
  )
}

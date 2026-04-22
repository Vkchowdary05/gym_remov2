"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { AddWorkoutContent } from "@/components/workout/add-workout-content"

export default function AddWorkoutPage() {
  return (
    <ProtectedLayout>
      <AddWorkoutContent />
    </ProtectedLayout>
  )
}

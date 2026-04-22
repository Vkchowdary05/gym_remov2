"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { AddWorkoutContent } from "@/components/workout/add-workout-content"
import { RestTimer } from "@/components/workout/rest-timer"

export default function AddWorkoutPage() {
  return (
    <ProtectedLayout>
      <AddWorkoutContent />
      <RestTimer defaultSeconds={90} />
    </ProtectedLayout>
  )
}

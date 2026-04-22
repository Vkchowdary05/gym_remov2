"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { ProgressContent } from "@/components/progress/progress-content"

export default function ProgressPage() {
  return (
    <ProtectedLayout>
      <ProgressContent />
    </ProtectedLayout>
  )
}

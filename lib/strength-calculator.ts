export type StrengthLevel = "poor" | "average" | "good" | "excellent" | "bodybuilder"

export interface StrengthBenchmark {
  poor: number
  average: number
  good: number
  excellent: number
  bodybuilder: number
}

// Benchmarks are relative to body weight (multipliers)
export const strengthBenchmarks: Record<string, StrengthBenchmark> = {
  benchPress: { poor: 0.5, average: 0.75, good: 1.0, excellent: 1.25, bodybuilder: 1.5 },
  squat: { poor: 0.75, average: 1.0, good: 1.25, excellent: 1.5, bodybuilder: 2.0 },
  deadlift: { poor: 1.0, average: 1.25, good: 1.5, excellent: 2.0, bodybuilder: 2.5 },
  shoulderPress: { poor: 0.35, average: 0.5, good: 0.65, excellent: 0.8, bodybuilder: 1.0 },
  barbellRow: { poor: 0.5, average: 0.65, good: 0.8, excellent: 1.0, bodybuilder: 1.25 },
  overheadPress: { poor: 0.35, average: 0.5, good: 0.65, excellent: 0.8, bodybuilder: 1.0 },
  legPress: { poor: 1.5, average: 2.0, good: 2.5, excellent: 3.0, bodybuilder: 4.0 },
  pullUps: { poor: 0.5, average: 0.75, good: 1.0, excellent: 1.25, bodybuilder: 1.5 },
}

export function calculateStrengthLevel(
  exercise: keyof typeof strengthBenchmarks,
  liftWeight: number,
  bodyWeight: number,
): StrengthLevel {
  const benchmark = strengthBenchmarks[exercise]
  const ratio = liftWeight / bodyWeight

  if (ratio >= benchmark.bodybuilder) return "bodybuilder"
  if (ratio >= benchmark.excellent) return "excellent"
  if (ratio >= benchmark.good) return "good"
  if (ratio >= benchmark.average) return "average"
  return "poor"
}

export function calculateDerivedStrengthLevel(ratio: number, benchmarks: StrengthBenchmark): StrengthLevel {
  if (ratio >= benchmarks.bodybuilder) return "bodybuilder"
  if (ratio >= benchmarks.excellent) return "excellent"
  if (ratio >= benchmarks.good) return "good"
  if (ratio >= benchmarks.average) return "average"
  return "poor"
}

export function getOverallStrengthLevel(assessment: Record<string, number>, bodyWeight: number): StrengthLevel {
  const levels = Object.entries(assessment).map(([exercise, weight]) => {
    if (strengthBenchmarks[exercise]) {
      return calculateStrengthLevel(exercise as keyof typeof strengthBenchmarks, weight, bodyWeight)
    }
    return "average"
  })

  const levelValues: Record<StrengthLevel, number> = {
    poor: 1,
    average: 2,
    good: 3,
    excellent: 4,
    bodybuilder: 5,
  }

  const avgValue = levels.reduce((sum, level) => sum + levelValues[level], 0) / levels.length

  if (avgValue >= 4.5) return "bodybuilder"
  if (avgValue >= 3.5) return "excellent"
  if (avgValue >= 2.5) return "good"
  if (avgValue >= 1.5) return "average"
  return "poor"
}

export const strengthLevelColors: Record<StrengthLevel, string> = {
  poor: "#EF4444", // Red
  average: "#3B82F6", // Blue
  good: "#FFFFFF", // White
  excellent: "#F59E0B", // Gold
  bodybuilder: "#E5E4E2", // Platinum
}

export const strengthLevelEmissive: Record<StrengthLevel, { color: string; intensity: number }> = {
  poor: { color: "#991B1B", intensity: 0.3 },
  average: { color: "#1E3A8A", intensity: 0.3 },
  good: { color: "#9CA3AF", intensity: 0.2 },
  excellent: { color: "#D97706", intensity: 0.4 },
  bodybuilder: { color: "#A1A1AA", intensity: 0.5 },
}

export const strengthLevelLabels: Record<StrengthLevel, string> = {
  poor: "Beginner",
  average: "Intermediate",
  good: "Advanced",
  excellent: "Elite",
  bodybuilder: "Pro Bodybuilder",
}

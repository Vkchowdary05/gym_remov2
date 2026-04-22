import { calculateDerivedStrengthLevel, strengthBenchmarks, type StrengthLevel } from "./strength-calculator"

interface StrengthAssessment {
  benchPress: number
  squat: number
  deadlift: number
  shoulderPress: number
  barbellRow: number
  overheadPress: number
  legPress: number
  pullUps: number
}

// Complete muscle group to color mapping based on the specification
export function calculateAllMuscleColors(
  assessment: StrengthAssessment | null,
  bodyWeight: number,
  gender: "male" | "female" | "other",
): Record<string, StrengthLevel> {
  // Default to average if no assessment data
  if (!assessment) {
    return getDefaultMuscleColors()
  }

  // Gender modifier for female athletes (adjust ratios up for equivalent level)
  const genderModifier = gender === "female" ? 1.4 : 1.0

  // Front view muscles
  const chestRatio = (assessment.benchPress / bodyWeight) * genderModifier
  const shoulderRatio = (assessment.shoulderPress / bodyWeight) * genderModifier
  const bicepsRatio = (assessment.barbellRow / bodyWeight) * 0.6 * genderModifier
  const forearmsRatio = ((assessment.benchPress + assessment.barbellRow) / 2 / bodyWeight) * 0.4 * genderModifier
  const coreRatio = ((assessment.deadlift + assessment.squat) / 2 / bodyWeight) * 0.5 * genderModifier
  const quadsRatio = ((assessment.squat + assessment.legPress * 0.5) / bodyWeight) * genderModifier
  const calvesRatio = (assessment.squat / bodyWeight) * 0.3 * genderModifier

  // Back view muscles
  const trapsRatio = ((assessment.barbellRow + assessment.pullUps * bodyWeight) / 2 / bodyWeight) * genderModifier
  const latsRatio = ((assessment.pullUps * bodyWeight + assessment.barbellRow) / 2 / bodyWeight) * genderModifier
  const lowerBackRatio = (assessment.deadlift / bodyWeight) * genderModifier
  const rearDeltsRatio = ((assessment.shoulderPress + assessment.barbellRow * 0.5) / bodyWeight) * genderModifier
  const tricepsRatio = ((assessment.benchPress * 0.6 + assessment.overheadPress) / bodyWeight) * genderModifier
  const glutesRatio = ((assessment.squat + assessment.deadlift) / 2 / bodyWeight) * genderModifier
  const hamstringsRatio = (assessment.deadlift / bodyWeight) * 0.8 * genderModifier

  return {
    // Front muscles
    chest: calculateDerivedStrengthLevel(chestRatio, strengthBenchmarks.benchPress),
    chest_left: calculateDerivedStrengthLevel(chestRatio, strengthBenchmarks.benchPress),
    chest_right: calculateDerivedStrengthLevel(chestRatio, strengthBenchmarks.benchPress),
    shoulders: calculateDerivedStrengthLevel(shoulderRatio, strengthBenchmarks.shoulderPress),
    shoulder_left: calculateDerivedStrengthLevel(shoulderRatio, strengthBenchmarks.shoulderPress),
    shoulder_right: calculateDerivedStrengthLevel(shoulderRatio, strengthBenchmarks.shoulderPress),
    front_delts: calculateDerivedStrengthLevel(shoulderRatio, strengthBenchmarks.shoulderPress),
    biceps: calculateDerivedStrengthLevel(bicepsRatio, strengthBenchmarks.barbellRow),
    bicep_left: calculateDerivedStrengthLevel(bicepsRatio, strengthBenchmarks.barbellRow),
    bicep_right: calculateDerivedStrengthLevel(bicepsRatio, strengthBenchmarks.barbellRow),
    forearms: calculateDerivedStrengthLevel(forearmsRatio, strengthBenchmarks.barbellRow),
    forearm_left: calculateDerivedStrengthLevel(forearmsRatio, strengthBenchmarks.barbellRow),
    forearm_right: calculateDerivedStrengthLevel(forearmsRatio, strengthBenchmarks.barbellRow),
    core: calculateDerivedStrengthLevel(coreRatio, strengthBenchmarks.squat),
    abs: calculateDerivedStrengthLevel(coreRatio, strengthBenchmarks.squat),
    obliques: calculateDerivedStrengthLevel(coreRatio, strengthBenchmarks.squat),
    quads: calculateDerivedStrengthLevel(quadsRatio, strengthBenchmarks.squat),
    quad_left: calculateDerivedStrengthLevel(quadsRatio, strengthBenchmarks.squat),
    quad_right: calculateDerivedStrengthLevel(quadsRatio, strengthBenchmarks.squat),
    legs: calculateDerivedStrengthLevel(quadsRatio, strengthBenchmarks.squat),
    calves: calculateDerivedStrengthLevel(calvesRatio, {
      poor: 0.2,
      average: 0.3,
      good: 0.4,
      excellent: 0.5,
      bodybuilder: 0.6,
    }),
    calf_left: calculateDerivedStrengthLevel(calvesRatio, {
      poor: 0.2,
      average: 0.3,
      good: 0.4,
      excellent: 0.5,
      bodybuilder: 0.6,
    }),
    calf_right: calculateDerivedStrengthLevel(calvesRatio, {
      poor: 0.2,
      average: 0.3,
      good: 0.4,
      excellent: 0.5,
      bodybuilder: 0.6,
    }),

    // Back muscles
    traps: calculateDerivedStrengthLevel(trapsRatio, strengthBenchmarks.barbellRow),
    upper_back: calculateDerivedStrengthLevel(trapsRatio, strengthBenchmarks.barbellRow),
    lats: calculateDerivedStrengthLevel(latsRatio, strengthBenchmarks.barbellRow),
    lat_left: calculateDerivedStrengthLevel(latsRatio, strengthBenchmarks.barbellRow),
    lat_right: calculateDerivedStrengthLevel(latsRatio, strengthBenchmarks.barbellRow),
    back: calculateDerivedStrengthLevel(latsRatio, strengthBenchmarks.deadlift),
    lower_back: calculateDerivedStrengthLevel(lowerBackRatio, strengthBenchmarks.deadlift),
    erector_spinae: calculateDerivedStrengthLevel(lowerBackRatio, strengthBenchmarks.deadlift),
    rear_delts: calculateDerivedStrengthLevel(rearDeltsRatio, strengthBenchmarks.shoulderPress),
    triceps: calculateDerivedStrengthLevel(tricepsRatio, strengthBenchmarks.benchPress),
    tricep_left: calculateDerivedStrengthLevel(tricepsRatio, strengthBenchmarks.benchPress),
    tricep_right: calculateDerivedStrengthLevel(tricepsRatio, strengthBenchmarks.benchPress),
    glutes: calculateDerivedStrengthLevel(glutesRatio, strengthBenchmarks.squat),
    glute_left: calculateDerivedStrengthLevel(glutesRatio, strengthBenchmarks.squat),
    glute_right: calculateDerivedStrengthLevel(glutesRatio, strengthBenchmarks.squat),
    hamstrings: calculateDerivedStrengthLevel(hamstringsRatio, strengthBenchmarks.deadlift),
    hamstring_left: calculateDerivedStrengthLevel(hamstringsRatio, strengthBenchmarks.deadlift),
    hamstring_right: calculateDerivedStrengthLevel(hamstringsRatio, strengthBenchmarks.deadlift),

    // Additional muscle variations for complete coverage
    neck: calculateDerivedStrengthLevel(trapsRatio * 0.5, strengthBenchmarks.barbellRow),
    serratus: calculateDerivedStrengthLevel(chestRatio * 0.7, strengthBenchmarks.benchPress),
    hip_flexors: calculateDerivedStrengthLevel(quadsRatio * 0.6, strengthBenchmarks.squat),
    adductors: calculateDerivedStrengthLevel(quadsRatio * 0.7, strengthBenchmarks.squat),
    tibialis: calculateDerivedStrengthLevel(calvesRatio, {
      poor: 0.2,
      average: 0.3,
      good: 0.4,
      excellent: 0.5,
      bodybuilder: 0.6,
    }),
  }
}

function getDefaultMuscleColors(): Record<string, StrengthLevel> {
  return {
    chest: "average",
    chest_left: "average",
    chest_right: "average",
    shoulders: "average",
    shoulder_left: "average",
    shoulder_right: "average",
    front_delts: "average",
    biceps: "average",
    bicep_left: "average",
    bicep_right: "average",
    forearms: "average",
    forearm_left: "average",
    forearm_right: "average",
    core: "average",
    abs: "average",
    obliques: "average",
    quads: "average",
    quad_left: "average",
    quad_right: "average",
    legs: "average",
    calves: "average",
    calf_left: "average",
    calf_right: "average",
    traps: "average",
    upper_back: "average",
    lats: "average",
    lat_left: "average",
    lat_right: "average",
    back: "average",
    lower_back: "average",
    erector_spinae: "average",
    rear_delts: "average",
    triceps: "average",
    tricep_left: "average",
    tricep_right: "average",
    glutes: "average",
    glute_left: "average",
    glute_right: "average",
    hamstrings: "average",
    hamstring_left: "average",
    hamstring_right: "average",
    neck: "average",
    serratus: "average",
    hip_flexors: "average",
    adductors: "average",
    tibialis: "average",
  }
}

// Get the exercise associated with a muscle group
export function getMuscleExerciseMapping(muscle: string): { exercise: string; displayName: string } {
  const mapping: Record<string, { exercise: string; displayName: string }> = {
    chest: { exercise: "benchPress", displayName: "Bench Press" },
    chest_left: { exercise: "benchPress", displayName: "Bench Press" },
    chest_right: { exercise: "benchPress", displayName: "Bench Press" },
    shoulders: { exercise: "shoulderPress", displayName: "Shoulder Press" },
    shoulder_left: { exercise: "shoulderPress", displayName: "Shoulder Press" },
    shoulder_right: { exercise: "shoulderPress", displayName: "Shoulder Press" },
    front_delts: { exercise: "shoulderPress", displayName: "Shoulder Press" },
    rear_delts: { exercise: "shoulderPress", displayName: "Shoulder Press" },
    biceps: { exercise: "barbellRow", displayName: "Barbell Row" },
    bicep_left: { exercise: "barbellRow", displayName: "Barbell Row" },
    bicep_right: { exercise: "barbellRow", displayName: "Barbell Row" },
    triceps: { exercise: "benchPress", displayName: "Bench Press" },
    tricep_left: { exercise: "benchPress", displayName: "Bench Press" },
    tricep_right: { exercise: "benchPress", displayName: "Bench Press" },
    forearms: { exercise: "deadlift", displayName: "Deadlift" },
    forearm_left: { exercise: "deadlift", displayName: "Deadlift" },
    forearm_right: { exercise: "deadlift", displayName: "Deadlift" },
    core: { exercise: "squat", displayName: "Squat" },
    abs: { exercise: "squat", displayName: "Squat" },
    obliques: { exercise: "squat", displayName: "Squat" },
    back: { exercise: "deadlift", displayName: "Deadlift" },
    upper_back: { exercise: "barbellRow", displayName: "Barbell Row" },
    lats: { exercise: "barbellRow", displayName: "Barbell Row" },
    lat_left: { exercise: "barbellRow", displayName: "Barbell Row" },
    lat_right: { exercise: "barbellRow", displayName: "Barbell Row" },
    traps: { exercise: "barbellRow", displayName: "Barbell Row" },
    lower_back: { exercise: "deadlift", displayName: "Deadlift" },
    erector_spinae: { exercise: "deadlift", displayName: "Deadlift" },
    glutes: { exercise: "squat", displayName: "Squat" },
    glute_left: { exercise: "squat", displayName: "Squat" },
    glute_right: { exercise: "squat", displayName: "Squat" },
    legs: { exercise: "squat", displayName: "Squat" },
    quads: { exercise: "squat", displayName: "Squat" },
    quad_left: { exercise: "squat", displayName: "Squat" },
    quad_right: { exercise: "squat", displayName: "Squat" },
    hamstrings: { exercise: "deadlift", displayName: "Deadlift" },
    hamstring_left: { exercise: "deadlift", displayName: "Deadlift" },
    hamstring_right: { exercise: "deadlift", displayName: "Deadlift" },
    calves: { exercise: "squat", displayName: "Squat" },
    calf_left: { exercise: "squat", displayName: "Squat" },
    calf_right: { exercise: "squat", displayName: "Squat" },
    neck: { exercise: "barbellRow", displayName: "Barbell Row" },
    serratus: { exercise: "benchPress", displayName: "Bench Press" },
    hip_flexors: { exercise: "squat", displayName: "Squat" },
    adductors: { exercise: "squat", displayName: "Squat" },
    tibialis: { exercise: "squat", displayName: "Squat" },
  }

  return mapping[muscle] || { exercise: "squat", displayName: "Squat" }
}

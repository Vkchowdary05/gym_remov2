export type MuscleGroup = "chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "forearms" | "cardio"

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  description?: string
}

export const exercises: Exercise[] = [
  // Chest
  { id: "bench-press", name: "Bench Press", muscleGroup: "chest" },
  { id: "incline-bench-press", name: "Incline Bench Press", muscleGroup: "chest" },
  { id: "decline-bench-press", name: "Decline Bench Press", muscleGroup: "chest" },
  { id: "dumbbell-flyes", name: "Dumbbell Flyes", muscleGroup: "chest" },
  { id: "cable-crossover", name: "Cable Crossover", muscleGroup: "chest" },
  { id: "push-ups", name: "Push-ups", muscleGroup: "chest" },
  { id: "chest-dips", name: "Chest Dips", muscleGroup: "chest" },
  { id: "machine-chest-press", name: "Machine Chest Press", muscleGroup: "chest" },

  // Back
  { id: "deadlift", name: "Deadlift", muscleGroup: "back" },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "back" },
  { id: "pull-ups", name: "Pull-ups", muscleGroup: "back" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "back" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "back" },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "back" },
  { id: "dumbbell-row", name: "Dumbbell Row", muscleGroup: "back" },
  { id: "face-pulls", name: "Face Pulls", muscleGroup: "back" },

  // Shoulders
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "shoulders" },
  { id: "shoulder-press", name: "Shoulder Press", muscleGroup: "shoulders" },
  { id: "lateral-raises", name: "Lateral Raises", muscleGroup: "shoulders" },
  { id: "front-raises", name: "Front Raises", muscleGroup: "shoulders" },
  { id: "rear-delt-flyes", name: "Rear Delt Flyes", muscleGroup: "shoulders" },
  { id: "arnold-press", name: "Arnold Press", muscleGroup: "shoulders" },
  { id: "upright-rows", name: "Upright Rows", muscleGroup: "shoulders" },
  { id: "shrugs", name: "Shrugs", muscleGroup: "shoulders" },

  // Biceps
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "biceps" },
  { id: "dumbbell-curl", name: "Dumbbell Curl", muscleGroup: "biceps" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "biceps" },
  { id: "preacher-curl", name: "Preacher Curl", muscleGroup: "biceps" },
  { id: "concentration-curl", name: "Concentration Curl", muscleGroup: "biceps" },
  { id: "cable-curl", name: "Cable Curl", muscleGroup: "biceps" },
  { id: "incline-curl", name: "Incline Curl", muscleGroup: "biceps" },

  // Triceps
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "triceps" },
  { id: "skull-crushers", name: "Skull Crushers", muscleGroup: "triceps" },
  { id: "close-grip-bench", name: "Close Grip Bench Press", muscleGroup: "triceps" },
  { id: "overhead-extension", name: "Overhead Extension", muscleGroup: "triceps" },
  { id: "tricep-dips", name: "Tricep Dips", muscleGroup: "triceps" },
  { id: "kickbacks", name: "Kickbacks", muscleGroup: "triceps" },
  { id: "diamond-pushups", name: "Diamond Push-ups", muscleGroup: "triceps" },

  // Legs
  { id: "squat", name: "Squat", muscleGroup: "legs" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "legs" },
  { id: "lunges", name: "Lunges", muscleGroup: "legs" },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "legs" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "legs" },
  { id: "calf-raises", name: "Calf Raises", muscleGroup: "legs" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "legs" },
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "legs" },
  { id: "hack-squat", name: "Hack Squat", muscleGroup: "legs" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscleGroup: "legs" },

  // Forearms
  { id: "wrist-curl", name: "Wrist Curl", muscleGroup: "forearms" },
  { id: "reverse-wrist-curl", name: "Reverse Wrist Curl", muscleGroup: "forearms" },
  { id: "farmers-walk", name: "Farmer's Walk", muscleGroup: "forearms" },
  { id: "plate-pinch", name: "Plate Pinch", muscleGroup: "forearms" },

  // Cardio
  { id: "treadmill", name: "Treadmill", muscleGroup: "cardio" },
  { id: "cycling", name: "Cycling", muscleGroup: "cardio" },
  { id: "rowing", name: "Rowing", muscleGroup: "cardio" },
  { id: "elliptical", name: "Elliptical", muscleGroup: "cardio" },
  { id: "jump-rope", name: "Jump Rope", muscleGroup: "cardio" },
  { id: "stair-climber", name: "Stair Climber", muscleGroup: "cardio" },
]

export const getExercisesByMuscleGroup = (muscleGroup: MuscleGroup): Exercise[] => {
  return exercises.filter((e) => e.muscleGroup === muscleGroup)
}

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  legs: "Legs",
  forearms: "Forearms",
  cardio: "Cardio",
}

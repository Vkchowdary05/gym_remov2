export type MuscleGroup = "chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "forearms" | "cardio" | "neck" | "glutes" | "core" | "calves"

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  description?: string
  secondaryMuscles?: string
  equipment?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  isCompound?: boolean
}

export const exercises: Exercise[] = [
  // ============ CHEST ============
  { id: "bench-press", name: "Bench Press", muscleGroup: "chest", equipment: "Barbell", difficulty: "intermediate", isCompound: true, description: "Lie on a flat bench and press a barbell from chest level to full arm extension." },
  { id: "incline-bench-press", name: "Incline Bench Press", muscleGroup: "chest", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "decline-bench-press", name: "Decline Bench Press", muscleGroup: "chest", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "dumbbell-flyes", name: "Dumbbell Flyes", muscleGroup: "chest", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "cable-crossover", name: "Cable Crossover", muscleGroup: "chest", equipment: "Cable Machine", difficulty: "intermediate" },
  { id: "push-ups", name: "Push-ups", muscleGroup: "chest", equipment: "Bodyweight", difficulty: "beginner", isCompound: true },
  { id: "chest-dips", name: "Chest Dips", muscleGroup: "chest", equipment: "Dip Station", difficulty: "intermediate", isCompound: true },
  { id: "machine-chest-press", name: "Machine Chest Press", muscleGroup: "chest", equipment: "Machine", difficulty: "beginner" },
  { id: "pec-deck", name: "Pec Deck", muscleGroup: "chest", equipment: "Machine", difficulty: "beginner" },
  { id: "dumbbell-pullover", name: "Dumbbell Pullover", muscleGroup: "chest", equipment: "Dumbbell", difficulty: "intermediate" },
  { id: "svend-press", name: "Svend Press", muscleGroup: "chest", equipment: "Plate", difficulty: "beginner" },
  { id: "cable-fly-low", name: "Cable Fly (Low)", muscleGroup: "chest", equipment: "Cable Machine", difficulty: "intermediate" },
  { id: "cable-fly-mid", name: "Cable Fly (Mid)", muscleGroup: "chest", equipment: "Cable Machine", difficulty: "intermediate" },
  { id: "cable-fly-high", name: "Cable Fly (High)", muscleGroup: "chest", equipment: "Cable Machine", difficulty: "intermediate" },
  { id: "landmine-press", name: "Landmine Press", muscleGroup: "chest", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", muscleGroup: "chest", equipment: "Dumbbells", difficulty: "intermediate", isCompound: true },

  // ============ BACK ============
  { id: "deadlift", name: "Deadlift", muscleGroup: "back", equipment: "Barbell", difficulty: "advanced", isCompound: true, description: "Lift a barbell from the floor to hip level using your posterior chain." },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "back", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "pull-ups", name: "Pull-ups", muscleGroup: "back", equipment: "Pull-up Bar", difficulty: "intermediate", isCompound: true },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "back", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "back", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "back", equipment: "T-Bar", difficulty: "intermediate", isCompound: true },
  { id: "dumbbell-row", name: "Dumbbell Row", muscleGroup: "back", equipment: "Dumbbell", difficulty: "beginner" },
  { id: "face-pulls", name: "Face Pulls", muscleGroup: "back", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "rack-pull", name: "Rack Pull", muscleGroup: "back", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "sumo-deadlift", name: "Sumo Deadlift", muscleGroup: "back", equipment: "Barbell", difficulty: "advanced", isCompound: true },
  { id: "chest-supported-row", name: "Chest Supported Row", muscleGroup: "back", equipment: "Bench + Dumbbells", difficulty: "beginner" },
  { id: "meadows-row", name: "Meadows Row", muscleGroup: "back", equipment: "Barbell", difficulty: "advanced" },
  { id: "cable-pullover", name: "Cable Pullover", muscleGroup: "back", equipment: "Cable Machine", difficulty: "intermediate" },
  { id: "straight-arm-pushdown", name: "Straight Arm Pushdown", muscleGroup: "back", equipment: "Cable Machine", difficulty: "intermediate" },
  { id: "reverse-grip-pulldown", name: "Reverse Grip Pulldown", muscleGroup: "back", equipment: "Cable Machine", difficulty: "intermediate" },
  { id: "chin-ups", name: "Chin-ups", muscleGroup: "back", equipment: "Pull-up Bar", difficulty: "intermediate", isCompound: true },
  { id: "pendlay-row", name: "Pendlay Row", muscleGroup: "back", equipment: "Barbell", difficulty: "advanced", isCompound: true },

  // ============ SHOULDERS ============
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "shoulders", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "shoulder-press", name: "Shoulder Press", muscleGroup: "shoulders", equipment: "Dumbbells", difficulty: "intermediate", isCompound: true },
  { id: "lateral-raises", name: "Lateral Raises", muscleGroup: "shoulders", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "front-raises", name: "Front Raises", muscleGroup: "shoulders", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "rear-delt-flyes", name: "Rear Delt Flyes", muscleGroup: "shoulders", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "arnold-press", name: "Arnold Press", muscleGroup: "shoulders", equipment: "Dumbbells", difficulty: "intermediate", isCompound: true },
  { id: "upright-rows", name: "Upright Rows", muscleGroup: "shoulders", equipment: "Barbell", difficulty: "intermediate" },
  { id: "shrugs", name: "Shrugs", muscleGroup: "shoulders", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "cable-lateral-raise", name: "Cable Lateral Raise", muscleGroup: "shoulders", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "plate-raises", name: "Plate Raises", muscleGroup: "shoulders", equipment: "Plate", difficulty: "beginner" },
  { id: "bus-driver", name: "Bus Driver", muscleGroup: "shoulders", equipment: "Plate", difficulty: "intermediate" },
  { id: "bradford-press", name: "Bradford Press", muscleGroup: "shoulders", equipment: "Barbell", difficulty: "advanced" },
  { id: "w-raises", name: "W-Raises", muscleGroup: "shoulders", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "band-pull-apart", name: "Band Pull Apart", muscleGroup: "shoulders", equipment: "Resistance Band", difficulty: "beginner" },
  { id: "military-press", name: "Military Press", muscleGroup: "shoulders", equipment: "Barbell", difficulty: "intermediate", isCompound: true },

  // ============ BICEPS ============
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "biceps", equipment: "Barbell", difficulty: "beginner" },
  { id: "dumbbell-curl", name: "Dumbbell Curl", muscleGroup: "biceps", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "biceps", equipment: "Dumbbells", difficulty: "beginner" },
  { id: "preacher-curl", name: "Preacher Curl", muscleGroup: "biceps", equipment: "Barbell", difficulty: "beginner" },
  { id: "concentration-curl", name: "Concentration Curl", muscleGroup: "biceps", equipment: "Dumbbell", difficulty: "beginner" },
  { id: "cable-curl", name: "Cable Curl", muscleGroup: "biceps", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "incline-curl", name: "Incline Curl", muscleGroup: "biceps", equipment: "Dumbbells", difficulty: "intermediate" },
  { id: "spider-curl", name: "Spider Curl", muscleGroup: "biceps", equipment: "Dumbbells", difficulty: "intermediate" },
  { id: "reverse-curl", name: "Reverse Curl", muscleGroup: "biceps", equipment: "Barbell", difficulty: "beginner" },
  { id: "drag-curl", name: "Drag Curl", muscleGroup: "biceps", equipment: "Barbell", difficulty: "intermediate" },
  { id: "zottman-curl", name: "Zottman Curl", muscleGroup: "biceps", equipment: "Dumbbells", difficulty: "intermediate" },
  { id: "cable-hammer-curl", name: "Cable Hammer Curl", muscleGroup: "biceps", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "ez-bar-curl", name: "EZ Bar Curl", muscleGroup: "biceps", equipment: "EZ Bar", difficulty: "beginner" },

  // ============ TRICEPS ============
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "triceps", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "skull-crushers", name: "Skull Crushers", muscleGroup: "triceps", equipment: "EZ Bar", difficulty: "intermediate" },
  { id: "close-grip-bench", name: "Close Grip Bench Press", muscleGroup: "triceps", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "overhead-extension", name: "Overhead Extension", muscleGroup: "triceps", equipment: "Dumbbell", difficulty: "beginner" },
  { id: "tricep-dips", name: "Tricep Dips", muscleGroup: "triceps", equipment: "Dip Station", difficulty: "intermediate", isCompound: true },
  { id: "kickbacks", name: "Kickbacks", muscleGroup: "triceps", equipment: "Dumbbell", difficulty: "beginner" },
  { id: "diamond-pushups", name: "Diamond Push-ups", muscleGroup: "triceps", equipment: "Bodyweight", difficulty: "intermediate" },
  { id: "jm-press", name: "JM Press", muscleGroup: "triceps", equipment: "Barbell", difficulty: "advanced" },
  { id: "tate-press", name: "Tate Press", muscleGroup: "triceps", equipment: "Dumbbells", difficulty: "intermediate" },
  { id: "rope-pushdown", name: "Rope Pushdown", muscleGroup: "triceps", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "single-arm-extension", name: "Single Arm Extension", muscleGroup: "triceps", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "floor-press", name: "Floor Press", muscleGroup: "triceps", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "bench-dip", name: "Bench Dip", muscleGroup: "triceps", equipment: "Bench", difficulty: "beginner" },

  // ============ LEGS ============
  { id: "squat", name: "Squat", muscleGroup: "legs", equipment: "Barbell", difficulty: "intermediate", isCompound: true, description: "A compound movement where you lower your body by bending at the knees and hips." },
  { id: "leg-press", name: "Leg Press", muscleGroup: "legs", equipment: "Machine", difficulty: "beginner", isCompound: true },
  { id: "lunges", name: "Lunges", muscleGroup: "legs", equipment: "Dumbbells", difficulty: "beginner", isCompound: true },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "legs", equipment: "Machine", difficulty: "beginner" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "legs", equipment: "Machine", difficulty: "beginner" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "legs", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "hack-squat", name: "Hack Squat", muscleGroup: "legs", equipment: "Machine", difficulty: "intermediate", isCompound: true },
  { id: "front-squat", name: "Front Squat", muscleGroup: "legs", equipment: "Barbell", difficulty: "advanced", isCompound: true },
  { id: "goblet-squat", name: "Goblet Squat", muscleGroup: "legs", equipment: "Dumbbell", difficulty: "beginner", isCompound: true },
  { id: "sissy-squat", name: "Sissy Squat", muscleGroup: "legs", equipment: "Bodyweight", difficulty: "advanced" },
  { id: "nordic-curl", name: "Nordic Curl", muscleGroup: "legs", equipment: "Bodyweight", difficulty: "advanced" },
  { id: "glute-ham-raise", name: "Glute Ham Raise", muscleGroup: "legs", equipment: "GHD", difficulty: "advanced" },
  { id: "step-up", name: "Step-up", muscleGroup: "legs", equipment: "Box + Dumbbells", difficulty: "beginner", isCompound: true },
  { id: "box-jump", name: "Box Jump", muscleGroup: "legs", equipment: "Plyo Box", difficulty: "intermediate" },
  { id: "wall-sit", name: "Wall Sit", muscleGroup: "legs", equipment: "Wall", difficulty: "beginner" },
  { id: "sumo-squat", name: "Sumo Squat", muscleGroup: "legs", equipment: "Dumbbell", difficulty: "beginner", isCompound: true },
  { id: "pause-squat", name: "Pause Squat", muscleGroup: "legs", equipment: "Barbell", difficulty: "advanced", isCompound: true },
  { id: "tempo-squat", name: "Tempo Squat", muscleGroup: "legs", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "split-squat", name: "Split Squat", muscleGroup: "legs", equipment: "Dumbbells", difficulty: "beginner", isCompound: true },
  { id: "lateral-lunge", name: "Lateral Lunge", muscleGroup: "legs", equipment: "Dumbbells", difficulty: "beginner", isCompound: true },
  { id: "curtsy-lunge", name: "Curtsy Lunge", muscleGroup: "legs", equipment: "Dumbbells", difficulty: "intermediate" },

  // ============ FOREARMS ============
  { id: "wrist-curl", name: "Wrist Curl", muscleGroup: "forearms", equipment: "Barbell", difficulty: "beginner" },
  { id: "reverse-wrist-curl", name: "Reverse Wrist Curl", muscleGroup: "forearms", equipment: "Barbell", difficulty: "beginner" },
  { id: "farmers-walk", name: "Farmer's Walk", muscleGroup: "forearms", equipment: "Dumbbells", difficulty: "beginner", isCompound: true },
  { id: "plate-pinch", name: "Plate Pinch", muscleGroup: "forearms", equipment: "Plates", difficulty: "beginner" },
  { id: "behind-back-wrist-curl", name: "Behind-the-Back Wrist Curl", muscleGroup: "forearms", equipment: "Barbell", difficulty: "beginner" },
  { id: "towel-pull-up", name: "Towel Pull-up", muscleGroup: "forearms", equipment: "Towel + Pull-up Bar", difficulty: "advanced" },
  { id: "dead-hang", name: "Dead Hang", muscleGroup: "forearms", equipment: "Pull-up Bar", difficulty: "beginner" },
  { id: "thick-bar-hold", name: "Thick Bar Hold", muscleGroup: "forearms", equipment: "Thick Bar", difficulty: "intermediate" },

  // ============ CARDIO ============
  { id: "treadmill", name: "Treadmill", muscleGroup: "cardio", equipment: "Treadmill", difficulty: "beginner" },
  { id: "cycling", name: "Cycling", muscleGroup: "cardio", equipment: "Bike", difficulty: "beginner" },
  { id: "rowing", name: "Rowing", muscleGroup: "cardio", equipment: "Rowing Machine", difficulty: "beginner" },
  { id: "elliptical", name: "Elliptical", muscleGroup: "cardio", equipment: "Elliptical", difficulty: "beginner" },
  { id: "jump-rope", name: "Jump Rope", muscleGroup: "cardio", equipment: "Jump Rope", difficulty: "beginner" },
  { id: "stair-climber", name: "Stair Climber", muscleGroup: "cardio", equipment: "Stair Machine", difficulty: "beginner" },
  { id: "hiit-interval", name: "HIIT Interval", muscleGroup: "cardio", equipment: "Various", difficulty: "advanced" },
  { id: "battle-ropes", name: "Battle Ropes", muscleGroup: "cardio", equipment: "Battle Ropes", difficulty: "intermediate" },
  { id: "sled-push", name: "Sled Push", muscleGroup: "cardio", equipment: "Sled", difficulty: "intermediate" },
  { id: "assault-bike", name: "Assault Bike", muscleGroup: "cardio", equipment: "Assault Bike", difficulty: "intermediate" },
  { id: "swimming", name: "Swimming", muscleGroup: "cardio", equipment: "Pool", difficulty: "beginner" },
  { id: "boxing", name: "Boxing", muscleGroup: "cardio", equipment: "Bag/Pads", difficulty: "intermediate" },
  { id: "hiking", name: "Hiking", muscleGroup: "cardio", equipment: "None", difficulty: "beginner" },

  // ============ NECK ============
  { id: "neck-flexion", name: "Neck Flexion", muscleGroup: "neck", equipment: "Plate/Harness", difficulty: "beginner" },
  { id: "neck-extension", name: "Neck Extension", muscleGroup: "neck", equipment: "Plate/Harness", difficulty: "beginner" },
  { id: "neck-lateral-flexion", name: "Neck Lateral Flexion", muscleGroup: "neck", equipment: "Plate/Harness", difficulty: "beginner" },
  { id: "wrestlers-bridge", name: "Wrestler's Bridge", muscleGroup: "neck", equipment: "Bodyweight", difficulty: "advanced" },

  // ============ GLUTES ============
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "glutes", equipment: "Barbell", difficulty: "intermediate", isCompound: true },
  { id: "glute-bridge", name: "Glute Bridge", muscleGroup: "glutes", equipment: "Barbell", difficulty: "beginner" },
  { id: "cable-kickback", name: "Cable Kickback", muscleGroup: "glutes", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "donkey-kick", name: "Donkey Kick", muscleGroup: "glutes", equipment: "Bodyweight", difficulty: "beginner" },
  { id: "fire-hydrant", name: "Fire Hydrant", muscleGroup: "glutes", equipment: "Bodyweight", difficulty: "beginner" },
  { id: "clamshell", name: "Clamshell", muscleGroup: "glutes", equipment: "Resistance Band", difficulty: "beginner" },
  { id: "frog-pump", name: "Frog Pump", muscleGroup: "glutes", equipment: "Bodyweight", difficulty: "beginner" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscleGroup: "glutes", equipment: "Dumbbells", difficulty: "intermediate", isCompound: true },

  // ============ CORE ============
  { id: "plank", name: "Plank", muscleGroup: "core", equipment: "Bodyweight", difficulty: "beginner" },
  { id: "hollow-hold", name: "Hollow Hold", muscleGroup: "core", equipment: "Bodyweight", difficulty: "intermediate" },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", muscleGroup: "core", equipment: "Ab Wheel", difficulty: "intermediate" },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "core", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscleGroup: "core", equipment: "Pull-up Bar", difficulty: "intermediate" },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "core", equipment: "Plate/Dumbbell", difficulty: "beginner" },
  { id: "dragon-flag", name: "Dragon Flag", muscleGroup: "core", equipment: "Bench", difficulty: "advanced" },
  { id: "l-sit", name: "L-Sit", muscleGroup: "core", equipment: "Parallel Bars", difficulty: "advanced" },
  { id: "pallof-press", name: "Pallof Press", muscleGroup: "core", equipment: "Cable Machine", difficulty: "beginner" },
  { id: "dead-bug", name: "Dead Bug", muscleGroup: "core", equipment: "Bodyweight", difficulty: "beginner" },

  // ============ CALVES ============
  { id: "calf-raises", name: "Standing Calf Raise", muscleGroup: "calves", equipment: "Machine", difficulty: "beginner" },
  { id: "seated-calf-raise", name: "Seated Calf Raise", muscleGroup: "calves", equipment: "Machine", difficulty: "beginner" },
  { id: "donkey-calf-raise", name: "Donkey Calf Raise", muscleGroup: "calves", equipment: "Machine", difficulty: "intermediate" },
  { id: "single-leg-calf-raise", name: "Single Leg Calf Raise", muscleGroup: "calves", equipment: "Bodyweight", difficulty: "beginner" },
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
  neck: "Neck",
  glutes: "Glutes",
  core: "Core",
  calves: "Calves",
}

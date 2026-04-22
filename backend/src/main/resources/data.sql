-- GymRemo Exercise Seed Data
-- Only inserts if the exercise doesn't already exist

INSERT INTO exercises (id, name, muscle_group, equipment, difficulty, is_compound, is_active, description) VALUES
-- CHEST
('bench-press', 'Bench Press', 'chest', 'Barbell', 'INTERMEDIATE', true, true, 'Lie on a flat bench and press a barbell from chest level to full arm extension.'),
('incline-bench-press', 'Incline Bench Press', 'chest', 'Barbell', 'INTERMEDIATE', true, true, null),
('decline-bench-press', 'Decline Bench Press', 'chest', 'Barbell', 'INTERMEDIATE', true, true, null),
('dumbbell-flyes', 'Dumbbell Flyes', 'chest', 'Dumbbells', 'BEGINNER', false, true, null),
('cable-crossover', 'Cable Crossover', 'chest', 'Cable Machine', 'INTERMEDIATE', false, true, null),
('push-ups', 'Push-ups', 'chest', 'Bodyweight', 'BEGINNER', true, true, null),
('incline-dumbbell-press', 'Incline Dumbbell Press', 'chest', 'Dumbbells', 'INTERMEDIATE', true, true, null),
-- BACK
('deadlift', 'Deadlift', 'back', 'Barbell', 'ADVANCED', true, true, 'Lift a barbell from the floor to hip level.'),
('barbell-row', 'Barbell Row', 'back', 'Barbell', 'INTERMEDIATE', true, true, null),
('pull-ups', 'Pull-ups', 'back', 'Pull-up Bar', 'INTERMEDIATE', true, true, null),
('lat-pulldown', 'Lat Pulldown', 'back', 'Cable Machine', 'BEGINNER', false, true, null),
('seated-cable-row', 'Seated Cable Row', 'back', 'Cable Machine', 'BEGINNER', false, true, null),
('dumbbell-row', 'Dumbbell Row', 'back', 'Dumbbell', 'BEGINNER', false, true, null),
('chin-ups', 'Chin-ups', 'back', 'Pull-up Bar', 'INTERMEDIATE', true, true, null),
-- SHOULDERS
('overhead-press', 'Overhead Press', 'shoulders', 'Barbell', 'INTERMEDIATE', true, true, null),
('shoulder-press', 'Shoulder Press', 'shoulders', 'Dumbbells', 'INTERMEDIATE', true, true, null),
('lateral-raises', 'Lateral Raises', 'shoulders', 'Dumbbells', 'BEGINNER', false, true, null),
('front-raises', 'Front Raises', 'shoulders', 'Dumbbells', 'BEGINNER', false, true, null),
('rear-delt-flyes', 'Rear Delt Flyes', 'shoulders', 'Dumbbells', 'BEGINNER', false, true, null),
('arnold-press', 'Arnold Press', 'shoulders', 'Dumbbells', 'INTERMEDIATE', true, true, null),
('shrugs', 'Shrugs', 'shoulders', 'Dumbbells', 'BEGINNER', false, true, null),
-- BICEPS
('barbell-curl', 'Barbell Curl', 'biceps', 'Barbell', 'BEGINNER', false, true, null),
('dumbbell-curl', 'Dumbbell Curl', 'biceps', 'Dumbbells', 'BEGINNER', false, true, null),
('hammer-curl', 'Hammer Curl', 'biceps', 'Dumbbells', 'BEGINNER', false, true, null),
('preacher-curl', 'Preacher Curl', 'biceps', 'Barbell', 'BEGINNER', false, true, null),
('cable-curl', 'Cable Curl', 'biceps', 'Cable Machine', 'BEGINNER', false, true, null),
-- TRICEPS
('tricep-pushdown', 'Tricep Pushdown', 'triceps', 'Cable Machine', 'BEGINNER', false, true, null),
('skull-crushers', 'Skull Crushers', 'triceps', 'EZ Bar', 'INTERMEDIATE', false, true, null),
('close-grip-bench', 'Close Grip Bench Press', 'triceps', 'Barbell', 'INTERMEDIATE', true, true, null),
('overhead-extension', 'Overhead Extension', 'triceps', 'Dumbbell', 'BEGINNER', false, true, null),
('rope-pushdown', 'Rope Pushdown', 'triceps', 'Cable Machine', 'BEGINNER', false, true, null),
-- LEGS
('squat', 'Squat', 'legs', 'Barbell', 'INTERMEDIATE', true, true, 'A compound movement targeting quads, glutes, and core.'),
('leg-press', 'Leg Press', 'legs', 'Machine', 'BEGINNER', true, true, null),
('lunges', 'Lunges', 'legs', 'Dumbbells', 'BEGINNER', true, true, null),
('leg-extension', 'Leg Extension', 'legs', 'Machine', 'BEGINNER', false, true, null),
('leg-curl', 'Leg Curl', 'legs', 'Machine', 'BEGINNER', false, true, null),
('romanian-deadlift', 'Romanian Deadlift', 'legs', 'Barbell', 'INTERMEDIATE', true, true, null),
('hack-squat', 'Hack Squat', 'legs', 'Machine', 'INTERMEDIATE', true, true, null),
('goblet-squat', 'Goblet Squat', 'legs', 'Dumbbell', 'BEGINNER', true, true, null),
-- GLUTES
('hip-thrust', 'Hip Thrust', 'glutes', 'Barbell', 'INTERMEDIATE', true, true, null),
('glute-bridge', 'Glute Bridge', 'glutes', 'Barbell', 'BEGINNER', false, true, null),
('bulgarian-split-squat', 'Bulgarian Split Squat', 'glutes', 'Dumbbells', 'INTERMEDIATE', true, true, null),
-- CORE
('plank', 'Plank', 'core', 'Bodyweight', 'BEGINNER', false, true, null),
('hanging-leg-raise', 'Hanging Leg Raise', 'core', 'Pull-up Bar', 'INTERMEDIATE', false, true, null),
('cable-crunch', 'Cable Crunch', 'core', 'Cable Machine', 'BEGINNER', false, true, null),
('russian-twist', 'Russian Twist', 'core', 'Plate/Dumbbell', 'BEGINNER', false, true, null),
-- CALVES
('calf-raises', 'Standing Calf Raise', 'calves', 'Machine', 'BEGINNER', false, true, null),
('seated-calf-raise', 'Seated Calf Raise', 'calves', 'Machine', 'BEGINNER', false, true, null),
-- CARDIO
('treadmill', 'Treadmill', 'cardio', 'Treadmill', 'BEGINNER', false, true, null),
('cycling', 'Cycling', 'cardio', 'Bike', 'BEGINNER', false, true, null),
('rowing', 'Rowing', 'cardio', 'Rowing Machine', 'BEGINNER', false, true, null),
('jump-rope', 'Jump Rope', 'cardio', 'Jump Rope', 'BEGINNER', false, true, null)
ON CONFLICT (id) DO NOTHING;

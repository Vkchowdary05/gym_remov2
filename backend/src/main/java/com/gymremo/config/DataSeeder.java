package com.gymremo.config;

import com.gymremo.entity.WorkoutTemplate;
import com.gymremo.repository.WorkoutTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final WorkoutTemplateRepository templateRepository;

    @Override
    public void run(String... args) {
        seedSystemTemplates();
    }

    private void seedSystemTemplates() {
        List<WorkoutTemplate> existing = templateRepository.findByIsSystemTemplateTrue();
        if (!existing.isEmpty()) {
            log.info("System templates already seeded ({} found), skipping.", existing.size());
            return;
        }

        log.info("Seeding system workout templates...");

        List<WorkoutTemplate> templates = List.of(
            WorkoutTemplate.builder()
                .name("Push Day (PPL)")
                .description("Chest, shoulders, and triceps focused session")
                .category("Push Pull Legs")
                .isSystemTemplate(true)
                .isPublic(true)
                .templateData("""
                    {"muscleGroups":[
                        {"muscleGroup":"chest","exercises":[
                            {"exerciseName":"Bench Press","sets":[{"reps":8},{"reps":8},{"reps":6},{"reps":6}]},
                            {"exerciseName":"Incline Dumbbell Press","sets":[{"reps":10},{"reps":10},{"reps":8}]}
                        ]},
                        {"muscleGroup":"shoulders","exercises":[
                            {"exerciseName":"Overhead Press","sets":[{"reps":10},{"reps":8},{"reps":8}]},
                            {"exerciseName":"Lateral Raises","sets":[{"reps":15},{"reps":12},{"reps":12}]}
                        ]},
                        {"muscleGroup":"triceps","exercises":[
                            {"exerciseName":"Tricep Pushdown","sets":[{"reps":12},{"reps":10},{"reps":10}]},
                            {"exerciseName":"Overhead Extension","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]}
                    ]}""")
                .build(),

            WorkoutTemplate.builder()
                .name("Pull Day (PPL)")
                .description("Back and biceps focused session")
                .category("Push Pull Legs")
                .isSystemTemplate(true)
                .isPublic(true)
                .templateData("""
                    {"muscleGroups":[
                        {"muscleGroup":"back","exercises":[
                            {"exerciseName":"Deadlift","sets":[{"reps":5},{"reps":5},{"reps":3}]},
                            {"exerciseName":"Barbell Row","sets":[{"reps":8},{"reps":8},{"reps":6},{"reps":6}]},
                            {"exerciseName":"Lat Pulldown","sets":[{"reps":10},{"reps":10},{"reps":8}]},
                            {"exerciseName":"Seated Cable Row","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]},
                        {"muscleGroup":"biceps","exercises":[
                            {"exerciseName":"Barbell Curl","sets":[{"reps":10},{"reps":8},{"reps":8}]},
                            {"exerciseName":"Hammer Curl","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]}
                    ]}""")
                .build(),

            WorkoutTemplate.builder()
                .name("Leg Day (PPL)")
                .description("Complete lower body workout")
                .category("Push Pull Legs")
                .isSystemTemplate(true)
                .isPublic(true)
                .templateData("""
                    {"muscleGroups":[
                        {"muscleGroup":"legs","exercises":[
                            {"exerciseName":"Squat","sets":[{"reps":8},{"reps":6},{"reps":6},{"reps":5}]},
                            {"exerciseName":"Romanian Deadlift","sets":[{"reps":10},{"reps":8},{"reps":8}]},
                            {"exerciseName":"Leg Press","sets":[{"reps":12},{"reps":10},{"reps":10}]},
                            {"exerciseName":"Leg Curl","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]},
                        {"muscleGroup":"glutes","exercises":[
                            {"exerciseName":"Hip Thrust","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]},
                        {"muscleGroup":"calves","exercises":[
                            {"exerciseName":"Standing Calf Raise","sets":[{"reps":15},{"reps":15},{"reps":12},{"reps":12}]}
                        ]}
                    ]}""")
                .build(),

            WorkoutTemplate.builder()
                .name("Upper Body")
                .description("Balanced upper body push and pull")
                .category("Upper Lower")
                .isSystemTemplate(true)
                .isPublic(true)
                .templateData("""
                    {"muscleGroups":[
                        {"muscleGroup":"chest","exercises":[
                            {"exerciseName":"Bench Press","sets":[{"reps":8},{"reps":6},{"reps":6},{"reps":5}]}
                        ]},
                        {"muscleGroup":"back","exercises":[
                            {"exerciseName":"Barbell Row","sets":[{"reps":8},{"reps":6},{"reps":6},{"reps":5}]}
                        ]},
                        {"muscleGroup":"shoulders","exercises":[
                            {"exerciseName":"Shoulder Press","sets":[{"reps":10},{"reps":8},{"reps":8}]},
                            {"exerciseName":"Lat Pulldown","sets":[{"reps":10},{"reps":10},{"reps":8}]}
                        ]},
                        {"muscleGroup":"biceps","exercises":[
                            {"exerciseName":"Dumbbell Curl","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]},
                        {"muscleGroup":"triceps","exercises":[
                            {"exerciseName":"Skull Crushers","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]}
                    ]}""")
                .build(),

            WorkoutTemplate.builder()
                .name("Lower Body")
                .description("Quads, hamstrings, glutes, and calves")
                .category("Upper Lower")
                .isSystemTemplate(true)
                .isPublic(true)
                .templateData("""
                    {"muscleGroups":[
                        {"muscleGroup":"legs","exercises":[
                            {"exerciseName":"Squat","sets":[{"reps":8},{"reps":6},{"reps":6},{"reps":5}]},
                            {"exerciseName":"Romanian Deadlift","sets":[{"reps":10},{"reps":8},{"reps":8}]},
                            {"exerciseName":"Leg Extension","sets":[{"reps":15},{"reps":12},{"reps":12}]},
                            {"exerciseName":"Leg Curl","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]},
                        {"muscleGroup":"glutes","exercises":[
                            {"exerciseName":"Bulgarian Split Squat","sets":[{"reps":12},{"reps":10},{"reps":10}]}
                        ]},
                        {"muscleGroup":"core","exercises":[
                            {"exerciseName":"Plank","sets":[{"reps":60},{"reps":60},{"reps":60}]}
                        ]}
                    ]}""")
                .build(),

            WorkoutTemplate.builder()
                .name("5x5 Strength")
                .description("Classic 5x5 strength building program")
                .category("Strength")
                .isSystemTemplate(true)
                .isPublic(true)
                .templateData("""
                    {"muscleGroups":[
                        {"muscleGroup":"legs","exercises":[
                            {"exerciseName":"Squat","sets":[{"reps":5},{"reps":5},{"reps":5},{"reps":5},{"reps":5}]}
                        ]},
                        {"muscleGroup":"chest","exercises":[
                            {"exerciseName":"Bench Press","sets":[{"reps":5},{"reps":5},{"reps":5},{"reps":5},{"reps":5}]}
                        ]},
                        {"muscleGroup":"back","exercises":[
                            {"exerciseName":"Barbell Row","sets":[{"reps":5},{"reps":5},{"reps":5},{"reps":5},{"reps":5}]}
                        ]}
                    ]}""")
                .build()
        );

        templateRepository.saveAll(templates);
        log.info("Seeded {} system workout templates.", templates.size());
    }
}

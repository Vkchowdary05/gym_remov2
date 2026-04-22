package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "workout_sets")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutSet {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_exercise_id", nullable = false)
    private WorkoutExercise workoutExercise;

    @Column(name = "set_number", nullable = false) private Integer setNumber;
    @Column(name = "weight_kg") private Double weightKg;
    @Column(name = "reps") private Integer reps;
    @Column(name = "rpe") private Double rpe;
    @Column(name = "is_warmup") private Boolean isWarmup;
    @Column(name = "is_drop_set") private Boolean isDropSet;
    @Column(name = "is_personal_record") private Boolean isPersonalRecord;
    @Column(name = "rest_seconds_after") private Integer restSecondsAfter;
}

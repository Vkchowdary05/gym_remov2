package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_exercises")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutExercise {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_muscle_group_id", nullable = false)
    private WorkoutMuscleGroup workoutMuscleGroup;

    @Column(name = "exercise_id") private String exerciseId;
    @Column(name = "exercise_name", nullable = false) private String exerciseName;
    @Column(name = "display_order") private Integer displayOrder;
    @Column(name = "notes") private String notes;

    @OneToMany(mappedBy = "workoutExercise", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("setNumber ASC")
    @Builder.Default
    private List<WorkoutSet> sets = new ArrayList<>();
}

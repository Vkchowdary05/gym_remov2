package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_muscle_groups")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutMuscleGroup {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @Column(name = "muscle_group", nullable = false) private String muscleGroup;
    @Column(name = "display_order") private Integer displayOrder;

    @OneToMany(mappedBy = "workoutMuscleGroup", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<WorkoutExercise> exercises = new ArrayList<>();
}

package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "workout_date", nullable = false)
    private LocalDateTime workoutDate;

    @Column(name = "total_volume_kg") private Double totalVolumeKg;
    @Column(name = "total_sets") private Integer totalSets;
    @Column(name = "duration_minutes") private Integer durationMinutes;
    @Column(name = "notes", columnDefinition = "TEXT") private String notes;
    @Column(name = "perceived_exertion") private Integer perceivedExertion;

    @Column(name = "mood")
    @Enumerated(EnumType.STRING)
    private WorkoutMood mood;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<WorkoutMuscleGroup> muscleGroups = new ArrayList<>();

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum WorkoutMood { GREAT, GOOD, OKAY, TIRED, TERRIBLE }
}

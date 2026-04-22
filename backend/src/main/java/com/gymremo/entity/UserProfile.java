package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "name")
    private String name;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "date_of_birth")
    private java.time.LocalDate dateOfBirth;

    @Column(name = "fitness_goal")
    @Enumerated(EnumType.STRING)
    private FitnessGoal fitnessGoal;

    @Column(name = "experience_level")
    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel;

    @Column(name = "onboarded")
    private boolean onboarded;

    @Column(name = "preferred_theme")
    private String preferredTheme;

    @Column(name = "rest_timer_seconds")
    private Integer restTimerSeconds;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum Gender { male, female, other }
    public enum FitnessGoal { BUILD_MUSCLE, LOSE_WEIGHT, IMPROVE_STRENGTH, INCREASE_ENDURANCE, STAY_HEALTHY, SPORT_PERFORMANCE }
    public enum ExperienceLevel { BEGINNER, INTERMEDIATE, ADVANCED, ELITE }
}

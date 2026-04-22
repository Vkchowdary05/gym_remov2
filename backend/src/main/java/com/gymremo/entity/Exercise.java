package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "exercises")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Exercise {
    @Id @Column(name = "id") private String id;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "muscle_group", nullable = false) private String muscleGroup;
    @Column(name = "secondary_muscles") private String secondaryMuscles;
    @Column(name = "equipment") private String equipment;
    @Column(name = "difficulty") @Enumerated(EnumType.STRING) private Difficulty difficulty;
    @Column(name = "description", columnDefinition = "TEXT") private String description;
    @Column(name = "instructions", columnDefinition = "TEXT") private String instructions;
    @Column(name = "tips", columnDefinition = "TEXT") private String tips;
    @Column(name = "is_compound") private Boolean isCompound;
    @Column(name = "is_active") private Boolean isActive;

    public enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }
}

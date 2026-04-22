package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "strength_assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StrengthAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "bench_press_kg") private Double benchPressKg;
    @Column(name = "squat_kg") private Double squatKg;
    @Column(name = "deadlift_kg") private Double deadliftKg;
    @Column(name = "shoulder_press_kg") private Double shoulderPressKg;
    @Column(name = "barbell_row_kg") private Double barbellRowKg;
    @Column(name = "overhead_press_kg") private Double overheadPressKg;
    @Column(name = "leg_press_kg") private Double legPressKg;
    @Column(name = "pull_ups_multiplier") private Double pullUpsMultiplier;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}

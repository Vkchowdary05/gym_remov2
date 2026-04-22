package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "body_weight_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BodyWeightLog {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false) private LocalDate logDate;
    @Column(name = "weight_kg", nullable = false) private Double weightKg;
    @Column(name = "body_fat_percentage") private Double bodyFatPercentage;
    @Column(name = "notes") private String notes;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}

package com.gymremo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_templates")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutTemplate {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "name", nullable = false) private String name;
    @Column(name = "description") private String description;
    @Column(name = "category") private String category;
    @Column(name = "template_data", columnDefinition = "TEXT", nullable = false) private String templateData;
    @Column(name = "is_public") private Boolean isPublic;
    @Column(name = "is_system_template") private Boolean isSystemTemplate;
    @Column(name = "times_used") private Integer timesUsed;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (timesUsed == null) timesUsed = 0;
        if (isPublic == null) isPublic = false;
        if (isSystemTemplate == null) isSystemTemplate = false;
    }
}

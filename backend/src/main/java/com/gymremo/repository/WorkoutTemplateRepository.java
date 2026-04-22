package com.gymremo.repository;

import com.gymremo.entity.WorkoutTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutTemplateRepository extends JpaRepository<WorkoutTemplate, String> {
    List<WorkoutTemplate> findByUserIdOrIsSystemTemplateTrue(String userId);
    List<WorkoutTemplate> findByIsSystemTemplateTrue();
}

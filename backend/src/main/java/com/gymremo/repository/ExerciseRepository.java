package com.gymremo.repository;

import com.gymremo.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, String> {
    List<Exercise> findByMuscleGroupAndIsActiveTrue(String muscleGroup);
    List<Exercise> findByIsActiveTrue();
}

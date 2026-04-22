package com.gymremo.controller;

import com.gymremo.dto.AuthDtos.ApiResponse;
import com.gymremo.entity.Exercise;
import com.gymremo.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Exercise>>> getAllExercises() {
        return ResponseEntity.ok(ApiResponse.ok(exerciseRepository.findByIsActiveTrue()));
    }

    @GetMapping("/muscle-group/{muscleGroup}")
    public ResponseEntity<ApiResponse<List<Exercise>>> getByMuscleGroup(
            @PathVariable String muscleGroup) {
        return ResponseEntity.ok(ApiResponse.ok(
            exerciseRepository.findByMuscleGroupAndIsActiveTrue(muscleGroup)));
    }
}

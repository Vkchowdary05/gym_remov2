package com.gymremo.controller;

import com.gymremo.dto.AuthDtos.*;
import com.gymremo.entity.User;
import com.gymremo.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkoutResponse>>> getWorkouts(
            @AuthenticationPrincipal User user) {
        List<WorkoutResponse> workouts = workoutService.getUserWorkouts(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(workouts));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkoutResponse>> createWorkout(
            @AuthenticationPrincipal User user,
            @RequestBody CreateWorkoutRequest request) {
        WorkoutResponse workout = workoutService.createWorkout(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(workout, "Workout created"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkout(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        workoutService.deleteWorkout(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Workout deleted"));
    }
}

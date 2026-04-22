package com.gymremo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

// ===== AUTH DTOs =====
@Data @NoArgsConstructor @AllArgsConstructor
public class AuthDtos {

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SignupRequest {
        private String email;
        private String password;
        private String displayName;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private long expiresIn;
        private UserResponse user;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class OnboardingRequest {
        private String name;
        private String gender;
        private Double weightKg;
        private Double heightCm;
        private Double benchPressKg;
        private Double squatKg;
        private Double deadliftKg;
        private Double shoulderPressKg;
        private Double barbellRowKg;
        private Double overheadPressKg;
        private Double legPressKg;
        private Double pullUpsMultiplier;
    }

    // ===== USER DTOs =====
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserResponse {
        private String uid;
        private String email;
        private String displayName;
        private String photoUrl;
        private ProfileResponse profile;
        private StrengthResponse strengthAssessment;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProfileResponse {
        private String name;
        private String gender;
        private double weight;
        private double height;
        private String fitnessGoal;
        private String experienceLevel;
        private boolean onboarded;
        private String preferredTheme;
        private Integer restTimerSeconds;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class StrengthResponse {
        private double benchPress;
        private double squat;
        private double deadlift;
        private double shoulderPress;
        private double barbellRow;
        private double overheadPress;
        private double legPress;
        private double pullUps;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ProfileUpdateRequest {
        private String name;
        private String gender;
        private Double weightKg;
        private Double heightCm;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class StrengthUpdateRequest {
        private Double benchPressKg;
        private Double squatKg;
        private Double deadliftKg;
        private Double shoulderPressKg;
        private Double barbellRowKg;
        private Double overheadPressKg;
        private Double legPressKg;
        private Double pullUpsMultiplier;
    }

    // ===== WORKOUT DTOs =====
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class WorkoutResponse {
        private String id;
        private String date;
        private double totalVolume;
        private int totalSets;
        private Integer durationMinutes;
        private String notes;
        private Integer perceivedExertion;
        private String mood;
        private List<MuscleGroupResponse> muscleGroups;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MuscleGroupResponse {
        private String muscleGroup;
        private List<ExerciseEntryResponse> exercises;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ExerciseEntryResponse {
        private String exerciseId;
        private String exerciseName;
        private String notes;
        private List<SetResponse> sets;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SetResponse {
        private double weight;
        private int reps;
        private Double rpe;
        private Boolean isWarmup;
        private Boolean isDropSet;
        private Boolean isPersonalRecord;
        private Integer restSecondsAfter;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CreateWorkoutRequest {
        private String date;
        private String notes;
        private List<MuscleGroupRequest> muscleGroups;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class MuscleGroupRequest {
        private String muscleGroup;
        private List<ExerciseEntryRequest> exercises;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ExerciseEntryRequest {
        private String exerciseId;
        private String exerciseName;
        private List<SetRequest> sets;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SetRequest {
        private Double weightKg;
        private Integer reps;
        private Double rpe;
    }

    // ===== API WRAPPER =====
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> ok(T data) {
            return ApiResponse.<T>builder().success(true).data(data).build();
        }

        public static <T> ApiResponse<T> ok(T data, String message) {
            return ApiResponse.<T>builder().success(true).data(data).message(message).build();
        }

        public static <T> ApiResponse<T> error(String message) {
            return ApiResponse.<T>builder().success(false).message(message).build();
        }
    }
}

package com.gymremo.controller;

import com.gymremo.dto.AuthDtos.ApiResponse;
import com.gymremo.entity.User;
import com.gymremo.entity.Workout;
import com.gymremo.repository.WorkoutRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final WorkoutRepository workoutRepository;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummary>> getSummary(
            @AuthenticationPrincipal User user) {

        List<Workout> allWorkouts = workoutRepository.findByUserIdOrderByWorkoutDateDesc(user.getId());

        if (allWorkouts.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(AnalyticsSummary.builder()
                .totalWorkouts(0).totalVolume(0.0).totalSets(0)
                .workoutsThisWeek(0).workoutsThisMonth(0)
                .currentStreak(0).averageWorkoutsPerWeek(0.0)
                .mostTrainedMuscleGroup("N/A")
                .build()));
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).withHour(0).withMinute(0);
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0);

        int workoutsThisWeek = (int) allWorkouts.stream()
            .filter(w -> w.getWorkoutDate().isAfter(weekStart)).count();

        int workoutsThisMonth = (int) allWorkouts.stream()
            .filter(w -> w.getWorkoutDate().isAfter(monthStart)).count();

        double totalVolume = allWorkouts.stream()
            .mapToDouble(w -> w.getTotalVolumeKg() != null ? w.getTotalVolumeKg() : 0).sum();

        int totalSets = allWorkouts.stream()
            .mapToInt(w -> w.getTotalSets() != null ? w.getTotalSets() : 0).sum();

        // Most trained muscle group
        Map<String, Long> muscleGroupCounts = allWorkouts.stream()
            .flatMap(w -> w.getMuscleGroups().stream())
            .collect(Collectors.groupingBy(
                mg -> mg.getMuscleGroup(),
                Collectors.counting()
            ));

        String mostTrained = muscleGroupCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("N/A");

        // Calculate streak
        int streak = calculateStreak(allWorkouts);

        // Average workouts per week
        LocalDateTime earliest = allWorkouts.get(allWorkouts.size() - 1).getWorkoutDate();
        long daysBetween = java.time.Duration.between(earliest, now).toDays();
        long weeks = Math.max(1, daysBetween / 7);
        double avgPerWeek = (double) allWorkouts.size() / weeks;

        AnalyticsSummary summary = AnalyticsSummary.builder()
            .totalWorkouts(allWorkouts.size())
            .totalVolume(totalVolume)
            .totalSets(totalSets)
            .workoutsThisWeek(workoutsThisWeek)
            .workoutsThisMonth(workoutsThisMonth)
            .currentStreak(streak)
            .averageWorkoutsPerWeek(Math.round(avgPerWeek * 10.0) / 10.0)
            .mostTrainedMuscleGroup(mostTrained)
            .build();

        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    private int calculateStreak(List<Workout> sortedWorkouts) {
        if (sortedWorkouts.isEmpty()) return 0;

        Set<String> workoutDates = sortedWorkouts.stream()
            .map(w -> w.getWorkoutDate().toLocalDate().toString())
            .collect(Collectors.toCollection(TreeSet::new));

        List<String> sorted = new ArrayList<>(workoutDates);
        Collections.sort(sorted, Collections.reverseOrder());

        int streak = 0;
        java.time.LocalDate current = java.time.LocalDate.now();

        for (String dateStr : sorted) {
            java.time.LocalDate d = java.time.LocalDate.parse(dateStr);
            long diff = java.time.temporal.ChronoUnit.DAYS.between(d, current);
            if (diff <= 1) {
                streak++;
                current = d;
            } else {
                break;
            }
        }

        return streak;
    }

    @Data
    @Builder
    public static class AnalyticsSummary {
        private int totalWorkouts;
        private double totalVolume;
        private int totalSets;
        private int workoutsThisWeek;
        private int workoutsThisMonth;
        private int currentStreak;
        private double averageWorkoutsPerWeek;
        private String mostTrainedMuscleGroup;
    }
}

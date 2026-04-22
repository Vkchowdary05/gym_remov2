package com.gymremo.service;

import com.gymremo.dto.AuthDtos.*;
import com.gymremo.entity.*;
import com.gymremo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<WorkoutResponse> getUserWorkouts(String userId) {
        return workoutRepository.findByUserIdOrderByWorkoutDateDesc(userId)
            .stream().map(this::toWorkoutResponse).collect(Collectors.toList());
    }

    @Transactional
    public WorkoutResponse createWorkout(String userId, CreateWorkoutRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime workoutDate;
        try {
            workoutDate = LocalDateTime.parse(request.getDate(), DateTimeFormatter.ISO_DATE_TIME);
        } catch (Exception e) {
            try {
                workoutDate = LocalDateTime.parse(request.getDate() + "T12:00:00");
            } catch (Exception ex) {
                workoutDate = LocalDateTime.now();
            }
        }

        Workout workout = Workout.builder()
            .user(user)
            .workoutDate(workoutDate)
            .notes(request.getNotes())
            .build();

        // Calculate totals
        int totalSets = 0;
        double totalVolume = 0;

        if (request.getMuscleGroups() != null) {
            int mgOrder = 0;
            for (MuscleGroupRequest mgReq : request.getMuscleGroups()) {
                WorkoutMuscleGroup wmg = WorkoutMuscleGroup.builder()
                    .workout(workout)
                    .muscleGroup(mgReq.getMuscleGroup())
                    .displayOrder(mgOrder++)
                    .build();

                if (mgReq.getExercises() != null) {
                    int exOrder = 0;
                    for (ExerciseEntryRequest exReq : mgReq.getExercises()) {
                        WorkoutExercise we = WorkoutExercise.builder()
                            .workoutMuscleGroup(wmg)
                            .exerciseId(exReq.getExerciseId())
                            .exerciseName(exReq.getExerciseName())
                            .displayOrder(exOrder++)
                            .build();

                        if (exReq.getSets() != null) {
                            int setNum = 1;
                            for (SetRequest setReq : exReq.getSets()) {
                                double weight = setReq.getWeightKg() != null ? setReq.getWeightKg() : 0;
                                int reps = setReq.getReps() != null ? setReq.getReps() : 0;

                                com.gymremo.entity.WorkoutSet ws = com.gymremo.entity.WorkoutSet.builder()
                                    .workoutExercise(we)
                                    .setNumber(setNum++)
                                    .weightKg(weight)
                                    .reps(reps)
                                    .rpe(setReq.getRpe())
                                    .build();

                                we.getSets().add(ws);
                                totalSets++;
                                totalVolume += weight * reps;
                            }
                        }
                        wmg.getExercises().add(we);
                    }
                }
                workout.getMuscleGroups().add(wmg);
            }
        }

        workout.setTotalSets(totalSets);
        workout.setTotalVolumeKg(totalVolume);

        workout = workoutRepository.save(workout);
        return toWorkoutResponse(workout);
    }

    @Transactional
    public void deleteWorkout(String userId, String workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
            .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        workoutRepository.delete(workout);
    }

    private WorkoutResponse toWorkoutResponse(Workout w) {
        return WorkoutResponse.builder()
            .id(w.getId())
            .date(w.getWorkoutDate().toString())
            .totalVolume(w.getTotalVolumeKg() != null ? w.getTotalVolumeKg() : 0)
            .totalSets(w.getTotalSets() != null ? w.getTotalSets() : 0)
            .durationMinutes(w.getDurationMinutes())
            .notes(w.getNotes())
            .perceivedExertion(w.getPerceivedExertion())
            .mood(w.getMood() != null ? w.getMood().name() : null)
            .muscleGroups(w.getMuscleGroups().stream().map(this::toMuscleGroupResponse).collect(Collectors.toList()))
            .build();
    }

    private MuscleGroupResponse toMuscleGroupResponse(WorkoutMuscleGroup mg) {
        return MuscleGroupResponse.builder()
            .muscleGroup(mg.getMuscleGroup())
            .exercises(mg.getExercises().stream().map(this::toExerciseResponse).collect(Collectors.toList()))
            .build();
    }

    private ExerciseEntryResponse toExerciseResponse(WorkoutExercise ex) {
        return ExerciseEntryResponse.builder()
            .exerciseId(ex.getExerciseId())
            .exerciseName(ex.getExerciseName())
            .notes(ex.getNotes())
            .sets(ex.getSets().stream().map(this::toSetResponse).collect(Collectors.toList()))
            .build();
    }

    private SetResponse toSetResponse(com.gymremo.entity.WorkoutSet s) {
        return SetResponse.builder()
            .weight(s.getWeightKg() != null ? s.getWeightKg() : 0)
            .reps(s.getReps() != null ? s.getReps() : 0)
            .rpe(s.getRpe())
            .isWarmup(s.getIsWarmup())
            .isDropSet(s.getIsDropSet())
            .isPersonalRecord(s.getIsPersonalRecord())
            .restSecondsAfter(s.getRestSecondsAfter())
            .build();
    }
}

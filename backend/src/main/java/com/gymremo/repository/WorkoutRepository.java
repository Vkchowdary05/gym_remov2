package com.gymremo.repository;

import com.gymremo.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, String> {
    List<Workout> findByUserIdOrderByWorkoutDateDesc(String userId);
    List<Workout> findByUserIdAndWorkoutDateBetweenOrderByWorkoutDateDesc(
        String userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(w) FROM Workout w WHERE w.user.id = :userId")
    long countByUserId(@Param("userId") String userId);
}

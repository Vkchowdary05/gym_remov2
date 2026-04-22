package com.gymremo.repository;

import com.gymremo.entity.BodyWeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BodyWeightLogRepository extends JpaRepository<BodyWeightLog, String> {
    List<BodyWeightLog> findByUserIdOrderByLogDateDesc(String userId);
}

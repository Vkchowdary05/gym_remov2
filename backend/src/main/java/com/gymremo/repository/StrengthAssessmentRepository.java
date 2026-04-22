package com.gymremo.repository;

import com.gymremo.entity.StrengthAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StrengthAssessmentRepository extends JpaRepository<StrengthAssessment, String> {
    Optional<StrengthAssessment> findByUserId(String userId);
}

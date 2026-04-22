package com.gymremo.controller;

import com.gymremo.dto.AuthDtos.ApiResponse;
import com.gymremo.entity.BodyWeightLog;
import com.gymremo.entity.User;
import com.gymremo.repository.BodyWeightLogRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/body-weight")
@RequiredArgsConstructor
public class BodyWeightController {

    private final BodyWeightLogRepository bodyWeightLogRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BodyWeightLog>>> getLogs(
            @AuthenticationPrincipal User user) {
        List<BodyWeightLog> logs = bodyWeightLogRepository.findByUserIdOrderByLogDateDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BodyWeightLog>> addLog(
            @AuthenticationPrincipal User user,
            @RequestBody BodyWeightLogRequest request) {

        BodyWeightLog log = BodyWeightLog.builder()
            .user(user)
            .logDate(request.getDate() != null ? LocalDate.parse(request.getDate()) : LocalDate.now())
            .weightKg(request.getWeightKg())
            .bodyFatPercentage(request.getBodyFatPercentage())
            .notes(request.getNotes())
            .build();

        log = bodyWeightLogRepository.save(log);
        return ResponseEntity.ok(ApiResponse.ok(log, "Weight logged"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLog(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {

        BodyWeightLog log = bodyWeightLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Log not found"));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        bodyWeightLogRepository.delete(log);
        return ResponseEntity.ok(ApiResponse.ok(null, "Log deleted"));
    }

    @Data
    public static class BodyWeightLogRequest {
        private String date;
        private Double weightKg;
        private Double bodyFatPercentage;
        private String notes;
    }
}

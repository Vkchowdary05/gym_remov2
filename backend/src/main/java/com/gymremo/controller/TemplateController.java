package com.gymremo.controller;

import com.gymremo.dto.AuthDtos.ApiResponse;
import com.gymremo.entity.User;
import com.gymremo.entity.WorkoutTemplate;
import com.gymremo.repository.WorkoutTemplateRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final WorkoutTemplateRepository templateRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkoutTemplate>>> getTemplates(
            @AuthenticationPrincipal User user) {
        List<WorkoutTemplate> templates = templateRepository.findByUserIdOrIsSystemTemplateTrue(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(templates));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkoutTemplate>> createTemplate(
            @AuthenticationPrincipal User user,
            @RequestBody CreateTemplateRequest request) {

        WorkoutTemplate template = WorkoutTemplate.builder()
            .user(user)
            .name(request.getName())
            .description(request.getDescription())
            .category(request.getCategory())
            .templateData(request.getTemplateData())
            .isPublic(false)
            .isSystemTemplate(false)
            .build();

        template = templateRepository.save(template);
        return ResponseEntity.ok(ApiResponse.ok(template, "Template created"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {

        WorkoutTemplate template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));

        if (template.getIsSystemTemplate()) {
            throw new RuntimeException("Cannot delete system templates");
        }
        if (template.getUser() == null || !template.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        templateRepository.delete(template);
        return ResponseEntity.ok(ApiResponse.ok(null, "Template deleted"));
    }

    @Data
    public static class CreateTemplateRequest {
        private String name;
        private String description;
        private String category;
        private String templateData;
    }
}

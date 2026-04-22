package com.gymremo.controller;

import com.gymremo.dto.AuthDtos.*;
import com.gymremo.entity.User;
import com.gymremo.entity.UserProfile;
import com.gymremo.entity.StrengthAssessment;
import com.gymremo.repository.*;
import com.gymremo.service.UserMapperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileRepository profileRepository;
    private final StrengthAssessmentRepository strengthRepository;
    private final UserMapperService userMapper;

    @PatchMapping("/me/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileUpdateRequest request) {

        UserProfile profile = profileRepository.findByUserId(user.getId())
            .orElse(UserProfile.builder().user(user).build());

        if (request.getName() != null) profile.setName(request.getName());
        if (request.getGender() != null) profile.setGender(UserProfile.Gender.valueOf(request.getGender()));
        if (request.getWeightKg() != null) profile.setWeightKg(request.getWeightKg());
        if (request.getHeightCm() != null) profile.setHeightCm(request.getHeightCm());
        profileRepository.save(profile);

        return ResponseEntity.ok(ApiResponse.ok(userMapper.toUserResponse(user)));
    }

    @PutMapping("/me/strength")
    public ResponseEntity<ApiResponse<UserResponse>> updateStrength(
            @AuthenticationPrincipal User user,
            @RequestBody StrengthUpdateRequest request) {

        StrengthAssessment strength = strengthRepository.findByUserId(user.getId())
            .orElse(StrengthAssessment.builder().user(user).build());

        if (request.getBenchPressKg() != null) strength.setBenchPressKg(request.getBenchPressKg());
        if (request.getSquatKg() != null) strength.setSquatKg(request.getSquatKg());
        if (request.getDeadliftKg() != null) strength.setDeadliftKg(request.getDeadliftKg());
        if (request.getShoulderPressKg() != null) strength.setShoulderPressKg(request.getShoulderPressKg());
        if (request.getBarbellRowKg() != null) strength.setBarbellRowKg(request.getBarbellRowKg());
        if (request.getOverheadPressKg() != null) strength.setOverheadPressKg(request.getOverheadPressKg());
        if (request.getLegPressKg() != null) strength.setLegPressKg(request.getLegPressKg());
        if (request.getPullUpsMultiplier() != null) strength.setPullUpsMultiplier(request.getPullUpsMultiplier());
        strengthRepository.save(strength);

        return ResponseEntity.ok(ApiResponse.ok(userMapper.toUserResponse(user)));
    }
}

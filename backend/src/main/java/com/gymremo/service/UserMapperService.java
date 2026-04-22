package com.gymremo.service;

import com.gymremo.dto.AuthDtos.*;
import com.gymremo.entity.*;
import com.gymremo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserMapperService {

    private final UserProfileRepository profileRepository;
    private final StrengthAssessmentRepository strengthRepository;

    public UserResponse toUserResponse(User user) {
        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        StrengthAssessment strength = strengthRepository.findByUserId(user.getId()).orElse(null);

        return UserResponse.builder()
            .uid(user.getId())
            .email(user.getEmail())
            .displayName(user.getDisplayName())
            .photoUrl(user.getPhotoUrl())
            .profile(profile != null ? toProfileResponse(profile) : null)
            .strengthAssessment(strength != null ? toStrengthResponse(strength) : null)
            .build();
    }

    private ProfileResponse toProfileResponse(UserProfile p) {
        return ProfileResponse.builder()
            .name(p.getName())
            .gender(p.getGender() != null ? p.getGender().name() : "male")
            .weight(p.getWeightKg() != null ? p.getWeightKg() : 70)
            .height(p.getHeightCm() != null ? p.getHeightCm() : 175)
            .fitnessGoal(p.getFitnessGoal() != null ? p.getFitnessGoal().name() : null)
            .experienceLevel(p.getExperienceLevel() != null ? p.getExperienceLevel().name() : null)
            .onboarded(p.isOnboarded())
            .preferredTheme(p.getPreferredTheme())
            .restTimerSeconds(p.getRestTimerSeconds())
            .build();
    }

    private StrengthResponse toStrengthResponse(StrengthAssessment s) {
        return StrengthResponse.builder()
            .benchPress(s.getBenchPressKg() != null ? s.getBenchPressKg() : 0)
            .squat(s.getSquatKg() != null ? s.getSquatKg() : 0)
            .deadlift(s.getDeadliftKg() != null ? s.getDeadliftKg() : 0)
            .shoulderPress(s.getShoulderPressKg() != null ? s.getShoulderPressKg() : 0)
            .barbellRow(s.getBarbellRowKg() != null ? s.getBarbellRowKg() : 0)
            .overheadPress(s.getOverheadPressKg() != null ? s.getOverheadPressKg() : 0)
            .legPress(s.getLegPressKg() != null ? s.getLegPressKg() : 0)
            .pullUps(s.getPullUpsMultiplier() != null ? s.getPullUpsMultiplier() : 0)
            .build();
    }
}

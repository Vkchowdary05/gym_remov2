package com.gymremo.service;

import com.gymremo.dto.AuthDtos.*;
import com.gymremo.entity.*;
import com.gymremo.repository.*;
import com.gymremo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final StrengthAssessmentRepository strengthRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapperService userMapper;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .displayName(request.getDisplayName() != null ? request.getDisplayName() : request.getEmail().split("@")[0])
            .provider(User.AuthProvider.LOCAL)
            .build();

        user = userRepository.save(user);

        // Create empty profile
        UserProfile profile = UserProfile.builder()
            .user(user)
            .name(user.getDisplayName())
            .gender(UserProfile.Gender.male)
            .weightKg(70.0)
            .heightCm(175.0)
            .onboarded(false)
            .build();
        profileRepository.save(profile);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return buildAuthResponse(user);
    }

    @Transactional
    public UserResponse completeOnboarding(String userId, OnboardingRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Update profile
        UserProfile profile = profileRepository.findByUserId(userId)
            .orElse(UserProfile.builder().user(user).build());

        profile.setName(request.getName());
        if (request.getGender() != null) {
            profile.setGender(UserProfile.Gender.valueOf(request.getGender()));
        }
        if (request.getWeightKg() != null) profile.setWeightKg(request.getWeightKg());
        if (request.getHeightCm() != null) profile.setHeightCm(request.getHeightCm());
        profile.setOnboarded(true);
        profileRepository.save(profile);

        // Update strength assessment
        StrengthAssessment strength = strengthRepository.findByUserId(userId)
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

        return userMapper.toUserResponse(user);
    }

    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toUserResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtTokenProvider.getJwtExpiration())
            .user(userMapper.toUserResponse(user))
            .build();
    }
}

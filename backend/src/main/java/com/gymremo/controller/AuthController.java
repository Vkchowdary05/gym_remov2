package com.gymremo.controller;

import com.gymremo.dto.AuthDtos.*;
import com.gymremo.entity.User;
import com.gymremo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Account created successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @RequestHeader("X-Refresh-Token") String refreshToken) {
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal User user) {
        UserResponse response = authService.getCurrentUser(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/onboarding")
    public ResponseEntity<ApiResponse<UserResponse>> completeOnboarding(
            @AuthenticationPrincipal User user,
            @RequestBody OnboardingRequest request) {
        UserResponse response = authService.completeOnboarding(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Onboarding completed"));
    }
}

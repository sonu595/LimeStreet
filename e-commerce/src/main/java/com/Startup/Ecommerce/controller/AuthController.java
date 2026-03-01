package com.Startup.Ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Startup.Ecommerce.Service.UserService;
import com.Startup.Ecommerce.dto.request.LoginRequest;
import com.Startup.Ecommerce.dto.request.RegisterRequest;
import com.Startup.Ecommerce.dto.request.ResetPasswordRequest;
import com.Startup.Ecommerce.dto.request.VerifyOtpRequest;
import com.Startup.Ecommerce.dto.response.ApiResponse;
import com.Startup.Ecommerce.dto.response.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String message = authService.verifyOtp(request);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }
    
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestParam String email) {
        String message = authService.resendOtp(email);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@RequestBody String refreshToken) {
        LoginResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", response));
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam String email) {
        String message = authService.forgotPassword(email);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String message = authService.resetPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }
}
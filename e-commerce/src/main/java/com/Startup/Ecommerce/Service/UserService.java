package com.Startup.Ecommerce.Service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Startup.Ecommerce.Enum.Status;
import com.Startup.Ecommerce.Models.User;
import com.Startup.Ecommerce.Repository.UserRepo;
import com.Startup.Ecommerce.dto.request.LoginRequest;
import com.Startup.Ecommerce.dto.request.RegisterRequest;
import com.Startup.Ecommerce.dto.request.ResetPasswordRequest;
import com.Startup.Ecommerce.dto.request.VerifyOtpRequest;
import com.Startup.Ecommerce.dto.response.LoginResponse;
import com.Startup.Ecommerce.exception.BadRequestException;
import com.Startup.Ecommerce.exception.NotFoundException;
import com.Startup.Ecommerce.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;
    private final OtpService otpService; 

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepo.findByEmail(request.getEmail())
                      .orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getStatus() != Status.ACTIVE) {
            throw new BadRequestException("Account is not active");
        }

        user.setFailedAttempt(0);
        userRepo.save(user);

        String accessToken = jwtService.generateToken(createUserDetails(user));
        String refreshToken = jwtService.generateRefreshToken(createUserDetails(user));

        user.setRefreshToken(refreshToken);
        userRepo.save(user);

        return new LoginResponse(accessToken, refreshToken);
    }

    public String register(RegisterRequest request){
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exist");            
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setStatus(Status.PENDING);
        user.setProvider("EMAIL");
        user.setFailedAttempt(0);
        user.setCreatedAt(LocalDateTime.now());

        userRepo.save(user);

        String otp = otpService.generateOtp(user.getEmail());  // ✅ Fixed
        emailService.sendOtpEmail(user.getEmail(), otp);

        return "Registration successful. please verify your email with the OTP sent to your email.";
    }

    public String verifyOtp(VerifyOtpRequest request){
        if (!otpService.validateOtp(request.getEmail(), request.getOtp())) {  // ✅ Fixed
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepo.findByEmail(request.getEmail())
                  .orElseThrow(() -> new NotFoundException("User not found"));

        user.setStatus(Status.ACTIVE);
        userRepo.save(user);

        otpService.clearOtp(request.getEmail());  // ✅ Fixed
        
        return "Email verified successfully";
    }

    public LoginResponse refreshToken(String refreshToken){
        User user = userRepo.findByRefreshToken(refreshToken)
                     .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new BadRequestException("Invalid refresh token");
        }

        String accessToken = jwtService.generateToken(userDetails);
        String newRefreshToken = jwtService.generateRefreshToken(userDetails);

        user.setRefreshToken(newRefreshToken);
        userRepo.save(user);

        return new LoginResponse(accessToken, newRefreshToken);
    }

    public String forgotPassword(String email){
        User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));

        String otp = otpService.generateOtp(email);  // ✅ Fixed
        emailService.sendPasswordResetOtpEmail(email, otp);

        return "OTP sent to your email for password reset";
    }

    public String resendOtp(String email) {
        User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));
        
        String otp = otpService.generateOtp(email);  // ✅ Fixed
        emailService.sendOtpEmail(email, otp);
        
        return "OTP resent successfully";
    }

    public String resetPassword(ResetPasswordRequest request){
        if (!otpService.validateOtp(request.getEmail(), request.getOtp())) {  // ✅ Fixed
            throw new BadRequestException("Invalid or expired Otp");
        }

        User user = userRepo.findByEmail(request.getEmail())
                     .orElseThrow(() -> new NotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);

        otpService.clearOtp(request.getEmail());  // ✅ Fixed

        return "Password reset successful";
    }

    private UserDetails createUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRole())
                    .build();
    }
}
package com.Startup.Ecommerce.Models;

import com.Startup.Ecommerce.Enum.Status;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    private String role;

    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(name = "provider")
    private String provider; // "OTP", "EMAIL", "GOOGLE" etc.
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    private int failedAttempt;
    private String verificationToken;
    private String resetPasswordToken;
    private String refreshToken;
    
    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }
}
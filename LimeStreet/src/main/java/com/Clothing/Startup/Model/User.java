package com.Clothing.Startup.Model;

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

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "address_line_1")
    private String addressLine1;

    @Column(name = "address_line_2")
    private String addressLine2;

    private String city;
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    private String country;
    
    @Column(name = "provider")
    private String provider; // "OTP", "EMAIL", "GOOGLE" etc.

    @Column(name = "role")
    private String role;
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();

        if (role == null || role.isBlank()) {
            role = "CUSTOMER";
        }

        if (country == null || country.isBlank()) {
            country = "India";
        }
    }
}

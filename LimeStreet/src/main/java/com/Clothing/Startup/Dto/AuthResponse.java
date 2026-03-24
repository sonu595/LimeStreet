package com.Clothing.Startup.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String id;
    private String role;
    private String message;
}

package com.Clothing.Startup.Util;

import com.Clothing.Startup.Model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "MySuperSecretKeyForJWTGeneration12345678901234567890";
    private final long EXPIRATION_TIME = 86400000; // 24 hours

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Generate Token
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());
        claims.put("id", user.getId());
        claims.put("role", user.getRole());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate Token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Extract Email from Token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extract Name from Token
    public String extractName(String token) {
        return extractAllClaims(token).get("name", String.class);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public Long extractUserId(String token) {
        Object id = extractAllClaims(token).get("id");

        if (id == null) {
            return null;
        }

        if (id instanceof Integer integerId) {
            return integerId.longValue();
        }

        if (id instanceof Long longId) {
            return longId;
        }

        return Long.valueOf(String.valueOf(id));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

package com.Clothing.Startup.Util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.Clothing.Startup.Model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

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
        } catch (Exception jwtError) {
            try {
                parseLegacyToken(token);
                return true;
            } catch (Exception ignored) {
                return false;
            }
        }
    }

    // Extract Email from Token
    public String extractEmail(String token) {
        return String.valueOf(extractClaim(token, "email"));
    }

    // Extract Name from Token
    public String extractName(String token) {
        return String.valueOf(extractClaim(token, "name"));
    }

    public String extractRole(String token) {
        return String.valueOf(extractClaim(token, "role"));
    }

    public Long extractUserId(String token) {
        Object id = extractClaim(token, "id");

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

    private Object extractClaim(String token, String key) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            if ("email".equals(key)) {
                return claims.getSubject();
            }

            return claims.get(key);
        } catch (Exception jwtError) {
            Map<String, Object> legacyClaims = parseLegacyToken(token);
            return legacyClaims.get(key);
        }
    }

    private Map<String, Object> parseLegacyToken(String token) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String json = new String(decodedBytes, StandardCharsets.UTF_8).trim();
            Map<String, Object> values = new HashMap<>();

            if (json.startsWith("{")) {
                json = json.substring(1);
            }

            if (json.endsWith("}")) {
                json = json.substring(0, json.length() - 1);
            }

            if (json.isBlank()) {
                return values;
            }

            String[] pairs = json.split(",");

            for (String pair : pairs) {
                String[] keyValue = pair.split(":", 2);

                if (keyValue.length != 2) {
                    continue;
                }

                String key = stripQuotes(keyValue[0].trim());
                String rawValue = keyValue[1].trim();

                if (rawValue.startsWith("\"") && rawValue.endsWith("\"")) {
                    values.put(key, stripQuotes(rawValue));
                    continue;
                }

                if ("null".equalsIgnoreCase(rawValue)) {
                    values.put(key, null);
                    continue;
                }

                try {
                    values.put(key, Long.valueOf(rawValue));
                } catch (NumberFormatException numberError) {
                    values.put(key, stripQuotes(rawValue));
                }
            }

            return values;
        } catch (Exception error) {
            throw new RuntimeException("Invalid legacy token", error);
        }
    }

    private String stripQuotes(String value) {
        String sanitized = value;

        if (sanitized.startsWith("\"")) {
            sanitized = sanitized.substring(1);
        }

        if (sanitized.endsWith("\"")) {
            sanitized = sanitized.substring(0, sanitized.length() - 1);
        }

        return sanitized.replace("\\\"", "\"");
    }
}

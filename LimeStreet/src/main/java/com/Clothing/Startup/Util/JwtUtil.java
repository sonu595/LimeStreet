package com.Clothing.Startup.Util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.Clothing.Startup.Model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private static final String CLAIM_NAME = "name";
    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_ID = "id";
    private static final String CLAIM_ROLE = "role";

    @Value("${JWT_SECRET:change-me-in-production-please-use-a-long-random-secret-key}")
    private String secretKey;

    @Value("${JWT_EXPIRATION_MS:86400000}")
    private long expirationTime;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setClaims(buildClaims(user))
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseJwtClaims(token);
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

    public String extractEmail(String token) {
        return String.valueOf(extractClaim(token, CLAIM_EMAIL));
    }

    public String extractName(String token) {
        return String.valueOf(extractClaim(token, CLAIM_NAME));
    }

    public String extractRole(String token) {
        return String.valueOf(extractClaim(token, CLAIM_ROLE));
    }

    public Long extractUserId(String token) {
        Object id = extractClaim(token, CLAIM_ID);

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

    private Map<String, Object> buildClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(CLAIM_NAME, user.getName());
        claims.put(CLAIM_EMAIL, user.getEmail());
        claims.put(CLAIM_ID, user.getId());
        claims.put(CLAIM_ROLE, user.getRole());
        return claims;
    }

    private Object extractClaim(String token, String key) {
        try {
            Claims claims = parseJwtClaims(token);

            if (CLAIM_EMAIL.equals(key)) {
                return claims.getSubject();
            }

            return claims.get(key);
        } catch (Exception jwtError) {
            Map<String, Object> legacyClaims = parseLegacyToken(token);
            return legacyClaims.get(key);
        }
    }

    private Claims parseJwtClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Map<String, Object> parseLegacyToken(String token) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String json = trimJsonObject(new String(decodedBytes, StandardCharsets.UTF_8).trim());
            Map<String, Object> values = new HashMap<>();

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
                values.put(key, parseLegacyValue(keyValue[1].trim()));
            }

            return values;
        } catch (Exception error) {
            throw new RuntimeException("Invalid legacy token", error);
        }
    }

    private String trimJsonObject(String json) {
        String cleanedJson = json;

        if (cleanedJson.startsWith("{")) {
            cleanedJson = cleanedJson.substring(1);
        }

        if (cleanedJson.endsWith("}")) {
            cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 1);
        }

        return cleanedJson;
    }

    private Object parseLegacyValue(String rawValue) {
        if (rawValue.startsWith("\"") && rawValue.endsWith("\"")) {
            return stripQuotes(rawValue);
        }

        if ("null".equalsIgnoreCase(rawValue)) {
            return null;
        }

        try {
            return Long.valueOf(rawValue);
        } catch (NumberFormatException numberError) {
            return stripQuotes(rawValue);
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

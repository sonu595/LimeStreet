package com.Clothing.Startup.Controller;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.Clothing.Startup.Model.User;
import com.Clothing.Startup.Repository.UserRepository;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String DEFAULT_COUNTRY = "India";
    private static final String DEFAULT_ROLE = "CUSTOMER";

    private final UserRepository repo;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user){
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole(DEFAULT_ROLE);
        }
        return repo.save(user);
    }

    @GetMapping
    public List<User> allUsers(@RequestParam(required = false) String email){
        if (email != null && !email.isBlank()) {
            return repo.findByEmail(email).map(List::of).orElseGet(List::of);
        }

        return repo.findAll();
    }

    @GetMapping("/me")
    public Map<String, Object> currentUser(@RequestHeader("Authorization") String authorizationHeader) {
        User user = findAuthenticatedUser(authorizationHeader);
        return buildUserResponse(user);
    }

    @PutMapping("/me")
    public Map<String, Object> updateCurrentUser(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> request) {
        User user = findAuthenticatedUser(authorizationHeader);

        user.setName(request.getOrDefault("name", user.getName()));
        user.setContactNumber(request.getOrDefault("contactNumber", user.getContactNumber()));
        user.setAddressLine1(request.getOrDefault("addressLine1", user.getAddressLine1()));
        user.setAddressLine2(request.getOrDefault("addressLine2", user.getAddressLine2()));
        user.setCity(request.getOrDefault("city", user.getCity()));
        user.setState(request.getOrDefault("state", user.getState()));
        user.setPostalCode(request.getOrDefault("postalCode", user.getPostalCode()));
        user.setCountry(request.getOrDefault("country", user.getCountry()));

        repo.save(user);
        return buildUserResponse(user);
    }
    
    @PostMapping("/login")
    public String login(@RequestBody User user){
        User dbUser = repo.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // OTP verify
        if ("OTP".equals(dbUser.getProvider())) {
            throw new RuntimeException("Please login with OTP");
        }

        if (user.getPassword().equals(dbUser.getPassword())) {
            return "Login successful";
        } else {
            throw new RuntimeException("Invalid Password");
        }
    }

    private User findAuthenticatedUser(String authorizationHeader) {
        String token = extractToken(authorizationHeader);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        Long userId = jwtUtil.extractUserId(token);

        if (userId != null) {
            return repo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        return repo.findByEmail(jwtUtil.extractEmail(token))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            throw new RuntimeException("Authorization token required");
        }

        return authorizationHeader.substring(BEARER_PREFIX.length());
    }

    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", user.getId());
        response.put("name", valueOrEmpty(user.getName()));
        response.put("email", valueOrEmpty(user.getEmail()));
        response.put("contactNumber", valueOrEmpty(user.getContactNumber()));
        response.put("addressLine1", valueOrEmpty(user.getAddressLine1()));
        response.put("addressLine2", valueOrEmpty(user.getAddressLine2()));
        response.put("city", valueOrEmpty(user.getCity()));
        response.put("state", valueOrEmpty(user.getState()));
        response.put("postalCode", valueOrEmpty(user.getPostalCode()));
        response.put("country", valueOrDefault(user.getCountry(), DEFAULT_COUNTRY));
        response.put("provider", valueOrEmpty(user.getProvider()));
        response.put("role", valueOrDefault(user.getRole(), DEFAULT_ROLE));
        response.put("createdAt", user.getCreatedAt());
        return response;
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value;
    }

    private String valueOrDefault(String value, String defaultValue) {
        return value == null ? defaultValue : value;
    }
}

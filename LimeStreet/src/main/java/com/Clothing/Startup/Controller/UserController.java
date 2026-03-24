package com.Clothing.Startup.Controller;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Clothing.Startup.Model.User;
import com.Clothing.Startup.Repository.UserRepository;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("CUSTOMER");
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
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token required");
        }

        String token = authorizationHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        Long userId = jwtUtil.extractUserId(token);
        User user = userId != null
                ? repo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"))
                : repo.findByEmail(jwtUtil.extractEmail(token)).orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName() == null ? "" : user.getName());
        response.put("email", user.getEmail() == null ? "" : user.getEmail());
        response.put("contactNumber", user.getContactNumber() == null ? "" : user.getContactNumber());
        response.put("provider", user.getProvider() == null ? "" : user.getProvider());
        response.put("role", user.getRole() == null ? "CUSTOMER" : user.getRole());
        response.put("createdAt", user.getCreatedAt());
        return response;
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
}

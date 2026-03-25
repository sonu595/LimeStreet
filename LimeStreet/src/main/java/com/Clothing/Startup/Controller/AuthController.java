package com.Clothing.Startup.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Clothing.Startup.Dto.AuthResponse;
import com.Clothing.Startup.Model.User;
import com.Clothing.Startup.Repository.UserRepository;
import com.Clothing.Startup.Service.EmailService;
import com.Clothing.Startup.Service.OtpService;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService;

    @PostMapping("/send-otp")
    public Map<String, String> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String purpose = request.getOrDefault("purpose", "login");

        boolean isExistingUser = userRepo.findByEmail(email).isPresent();

        if ("login".equalsIgnoreCase(purpose) && !isExistingUser) {
            throw new RuntimeException("User register nahi hai. Pehle create account karo.");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpService.storeOtp(email, otp);
        emailService.sendOtp(email, otp);

        System.out.println("OTP for " + email + ": " + otp);

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent to " + email);
        response.put("email", email);
        response.put("isExistingUser", String.valueOf(isExistingUser));
        return response;
    }

    @PostMapping("/verify-register")
    public AuthResponse verifyAndRegister(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String name = request.get("name");
        String contactNumber = request.get("contactNumber");

        String savedOtp = otpService.getOtp(email)
                .orElseThrow(() -> new RuntimeException("OTP missing ya expire ho gaya. Dobara OTP bhejo."));

        if (!savedOtp.equals(otp)) {
            throw new RuntimeException("Galat OTP! Dobara try karo.");
        }

        otpService.clearOtp(email);

        User user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            if (name == null || name.trim().isEmpty()) {
                name = email.split("@")[0];
            }

            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword("OTP_USER_" + UUID.randomUUID());
            user.setContactNumber(contactNumber);
            user.setProvider("OTP");
            user.setRole("CUSTOMER");
            user = userRepo.save(user);

            System.out.println("New user registered via OTP: " + email);
        } else {
            if ((user.getContactNumber() == null || user.getContactNumber().isBlank())
                    && contactNumber != null
                    && !contactNumber.isBlank()) {
                user.setContactNumber(contactNumber);
                user = userRepo.save(user);
            }
            System.out.println("Existing user logged in via OTP: " + email);
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
            token,
            user.getEmail(),
            user.getName(),
            user.getId().toString(),
            user.getRole(),
            "OTP verification successful!"
        );
    }

    @PostMapping("/verify-login")
    public AuthResponse verifyLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        String savedOtp = otpService.getOtp(email)
                .orElseThrow(() -> new RuntimeException("OTP missing ya expire ho gaya. Dobara OTP bhejo."));

        if (!savedOtp.equals(otp)) {
            throw new RuntimeException("Galat OTP!");
        }

        otpService.clearOtp(email);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User register nahi hai. Pehle register karo!"));

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
            token,
            user.getEmail(),
            user.getName(),
            user.getId().toString(),
            user.getRole(),
            "Login successful!"
        );
    }

    @PostMapping("/password-login")
    public AuthResponse passwordLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("OTP".equalsIgnoreCase(user.getProvider()) && (user.getPassword() == null || user.getPassword().startsWith("OTP_USER_"))) {
            throw new RuntimeException("Please login with OTP for this account.");
        }

        if (password == null || !password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getId().toString(),
                user.getRole(),
                "Login successful!"
        );
    }

    @GetMapping("/otp-status/{email}")
    public Map<String, Object> checkOtpStatus(@PathVariable String email) {
        Map<String, Object> status = new HashMap<>();

        if (otpService.hasOtp(email)) {
            status.put("otpSent", true);
            status.put("expired", false);
            status.put("timeLeftSeconds", otpService.getTimeLeftSeconds(email));
            status.put("message", "OTP valid");
        } else {
            status.put("otpSent", false);
            status.put("expired", true);
            status.put("timeLeftSeconds", 0);
            status.put("message", "No OTP sent");
        }

        return status;
    }
}

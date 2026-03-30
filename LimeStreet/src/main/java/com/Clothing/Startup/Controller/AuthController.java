package com.Clothing.Startup.Controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

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

    private static final String LOGIN_PURPOSE = "login";
    private static final String OTP_PROVIDER = "OTP";
    private static final String CUSTOMER_ROLE = "CUSTOMER";
    private static final String OTP_PASSWORD_PREFIX = "OTP_USER_";

    private final EmailService emailService;
    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public AuthController(
            EmailService emailService,
            UserRepository userRepo,
            JwtUtil jwtUtil,
            OtpService otpService) {
        this.emailService = emailService;
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
    }

    @PostMapping("/send-otp")
    public Map<String, String> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String purpose = request.getOrDefault("purpose", LOGIN_PURPOSE);
        boolean isExistingUser = userRepo.findByEmail(email).isPresent();

        if (LOGIN_PURPOSE.equalsIgnoreCase(purpose) && !isExistingUser) {
            throw new RuntimeException("User register nahi hai. Pehle create account karo.");
        }

        String otp = generateOtp();
        otpService.storeOtp(email, otp);
        emailService.sendOtp(email, otp);

        System.out.println("OTP for " + email + ": " + otp);
        return buildSendOtpResponse(email, isExistingUser);
    }

    @PostMapping("/verify-register")
    public AuthResponse verifyAndRegister(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String name = request.get("name");
        String contactNumber = request.get("contactNumber");

        validateOtp(email, otp, "Galat OTP! Dobara try karo.");

        User user = findOrCreateOtpUser(email, name, contactNumber);
        return buildAuthResponse(user, "OTP verification successful!");
    }

    @PostMapping("/verify-login")
    public AuthResponse verifyLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        validateOtp(email, otp, "Galat OTP!");

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User register nahi hai. Pehle register karo!"));

        return buildAuthResponse(user, "Login successful!");
    }

    @PostMapping("/password-login")
    public AuthResponse passwordLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ensurePasswordLoginAllowed(user);

        if (password == null || !password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return buildAuthResponse(user, "Login successful!");
    }

    @GetMapping("/otp-status/{email}")
    public Map<String, Object> checkOtpStatus(@PathVariable String email) {
        if (!otpService.hasOtp(email)) {
            return buildOtpStatus(false, true, 0, "No OTP sent");
        }

        return buildOtpStatus(true, false, otpService.getTimeLeftSeconds(email), "OTP valid");
    }

    private String generateOtp() {
        return String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
    }

    private Map<String, String> buildSendOtpResponse(String email, boolean isExistingUser) {
        Map<String, String> response = new LinkedHashMap<>();
        response.put("message", "OTP sent to " + email);
        response.put("email", email);
        response.put("isExistingUser", String.valueOf(isExistingUser));
        return response;
    }

    private void validateOtp(String email, String enteredOtp, String invalidOtpMessage) {
        String savedOtp = otpService.getOtp(email)
                .orElseThrow(() -> new RuntimeException("OTP missing ya expire ho gaya. Dobara OTP bhejo."));

        if (!savedOtp.equals(enteredOtp)) {
            throw new RuntimeException(invalidOtpMessage);
        }

        otpService.clearOtp(email);
    }

    private User findOrCreateOtpUser(String email, String name, String contactNumber) {
        User existingUser = userRepo.findByEmail(email).orElse(null);

        if (existingUser == null) {
            return createOtpUser(email, name, contactNumber);
        }

        updateMissingContactNumber(existingUser, contactNumber);
        System.out.println("Existing user logged in via OTP: " + email);
        return existingUser;
    }

    private User createOtpUser(String email, String name, String contactNumber) {
        User user = new User();
        user.setEmail(email);
        user.setName(resolveDisplayName(email, name));
        user.setPassword(OTP_PASSWORD_PREFIX + UUID.randomUUID());
        user.setContactNumber(contactNumber);
        user.setProvider(OTP_PROVIDER);
        user.setRole(CUSTOMER_ROLE);

        User savedUser = userRepo.save(user);
        System.out.println("New user registered via OTP: " + email);
        return savedUser;
    }

    private void updateMissingContactNumber(User user, String contactNumber) {
        boolean hasNoContactNumber = user.getContactNumber() == null || user.getContactNumber().isBlank();
        boolean hasNewContactNumber = contactNumber != null && !contactNumber.isBlank();

        if (!hasNoContactNumber || !hasNewContactNumber) {
            return;
        }

        user.setContactNumber(contactNumber);
        userRepo.save(user);
    }

    private String resolveDisplayName(String email, String name) {
        if (name != null && !name.trim().isEmpty()) {
            return name;
        }

        return email.split("@")[0];
    }

    private void ensurePasswordLoginAllowed(User user) {
        boolean otpOnlyAccount = OTP_PROVIDER.equalsIgnoreCase(user.getProvider());
        boolean hasGeneratedOtpPassword = user.getPassword() == null
                || user.getPassword().startsWith(OTP_PASSWORD_PREFIX);

        if (otpOnlyAccount && hasGeneratedOtpPassword) {
            throw new RuntimeException("Please login with OTP for this account.");
        }
    }

    private AuthResponse buildAuthResponse(User user, String message) {
        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getId().toString(),
                user.getRole(),
                message);
    }

    private Map<String, Object> buildOtpStatus(boolean otpSent, boolean expired, long timeLeftSeconds, String message) {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("otpSent", otpSent);
        status.put("expired", expired);
        status.put("timeLeftSeconds", timeLeftSeconds);
        status.put("message", message);
        return status;
    }
}

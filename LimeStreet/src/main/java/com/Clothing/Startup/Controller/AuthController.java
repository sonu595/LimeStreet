package com.Clothing.Startup.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Clothing.Startup.Dto.AuthResponse;
import com.Clothing.Startup.Model.User;
import com.Clothing.Startup.Repository.UserRepository;
import com.Clothing.Startup.Service.EmailService;
import com.Clothing.Startup.Util.JwtUtil;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // OTP storage
    private Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private Map<String, Long> expiryStorage = new ConcurrentHashMap<>();
    
    // Temporary storage for registration data
    private Map<String, String> tempUserStorage = new ConcurrentHashMap<>();
    
    /**
     * STEP 1: Send OTP for Registration/Login
     */
    @PostMapping("/send-otp")
    public Map<String, String> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        // Check if user already exists (optional - aap decide karo)
        // Agar chahte ho ki existing user bhi OTP se login kare to ye check hata do
        boolean isExistingUser = userRepo.findByEmail(email).isPresent();
        
        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Store OTP with expiry (5 minutes)
        otpStorage.put(email, otp);
        expiryStorage.put(email, System.currentTimeMillis() + 300000);
        
        // Store email in temp storage (registration process start)
        tempUserStorage.put(email, "PENDING");
        
        // Send email
        emailService.sendOtp(email, otp);
        
        // Console pe OTP print (testing ke liye)
        System.out.println("🔐 OTP for " + email + ": " + otp);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent to " + email);
        response.put("email", email);
        response.put("isExistingUser", String.valueOf(isExistingUser));
        
        return response;
    }
    
    /**
     * STEP 2: Verify OTP and Register/Login
     */
    @PostMapping("/verify-register")
    public AuthResponse verifyAndRegister(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String name = request.get("name"); // Sirf new users ke liye
        
        // Check OTP
        String savedOtp = otpStorage.get(email);
        Long expiry = expiryStorage.get(email);
        
        if (savedOtp == null || expiry == null) {
            throw new RuntimeException("❌ Pehle OTP bhejo!");
        }
        
        if (System.currentTimeMillis() > expiry) {
            otpStorage.remove(email);
            expiryStorage.remove(email);
            tempUserStorage.remove(email);
            throw new RuntimeException("❌ OTP expire ho gaya! Dobara OTP bhejo.");
        }
        
        if (!savedOtp.equals(otp)) {
            throw new RuntimeException("❌ Galat OTP! Dobara try karo.");
        }
        
        // OTP sahi hai - Cleanup
        otpStorage.remove(email);
        expiryStorage.remove(email);
        tempUserStorage.remove(email);
        
        // Check if user exists
        User user = userRepo.findByEmail(email).orElse(null);
        
        if (user == null) {
            // 🔴 NEW USER - Register karo
            if (name == null || name.trim().isEmpty()) {
                // Agar name nahi diya to email se name banao
                name = email.split("@")[0];
            }
            
            user = new User();
            user.setEmail(email);
            user.setName(name);
            // Password ki zaroorat nahi, but field blank nahi chhod sakte
            user.setPassword("OTP_USER_" + UUID.randomUUID().toString()); // Random password
            user.setProvider("OTP"); // OTP se register kiya
            user = userRepo.save(user);
            
            System.out.println("✅ New user registered via OTP: " + email);
        } else {
            // 🔴 EXISTING USER - Login karo
            System.out.println("✅ Existing user logged in via OTP: " + email);
        }
        
        // Generate JWT Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getName());
        
        return new AuthResponse(
            token, 
            user.getEmail(), 
            user.getName(), 
            user.getId().toString(),
            "OTP verification successful!"
        );
    }
    
    /**
     * STEP 3: Direct OTP Login (Sirf existing users ke liye)
     */
    @PostMapping("/verify-login")
    public AuthResponse verifyLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        // Check OTP
        String savedOtp = otpStorage.get(email);
        Long expiry = expiryStorage.get(email);
        
        if (savedOtp == null || expiry == null) {
            throw new RuntimeException("❌ Pehle OTP bhejo!");
        }
        
        if (System.currentTimeMillis() > expiry) {
            otpStorage.remove(email);
            expiryStorage.remove(email);
            throw new RuntimeException("❌ OTP expire ho gaya!");
        }
        
        if (!savedOtp.equals(otp)) {
            throw new RuntimeException("❌ Galat OTP!");
        }
        
        // Cleanup
        otpStorage.remove(email);
        expiryStorage.remove(email);
        
        // Find user
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("❌ User register nahi hai. Pehle register karo!"));
        
        // Generate Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getName());
        
        return new AuthResponse(
            token, 
            user.getEmail(), 
            user.getName(), 
            user.getId().toString(),
            "Login successful!"
        );
    }
    
    /**
     * Check OTP Status (Optional)
     */
    @GetMapping("/otp-status/{email}")
    public Map<String, Object> checkOtpStatus(@PathVariable String email) {
        Map<String, Object> status = new HashMap<>();
        
        if (otpStorage.containsKey(email)) {
            Long expiry = expiryStorage.get(email);
            boolean isExpired = System.currentTimeMillis() > expiry;
            long timeLeft = isExpired ? 0 : (expiry - System.currentTimeMillis()) / 1000;
            
            status.put("otpSent", true);
            status.put("expired", isExpired);
            status.put("timeLeftSeconds", timeLeft);
            status.put("message", isExpired ? "OTP expired" : "OTP valid");
        } else {
            status.put("otpSent", false);
            status.put("message", "No OTP sent");
        }
        
        return status;
    }
}
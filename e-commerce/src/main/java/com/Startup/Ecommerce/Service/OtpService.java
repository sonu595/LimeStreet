package com.Startup.Ecommerce.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.Startup.Ecommerce.exception.BadRequestException;

@Service
public class OtpService {
    
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();
    private final int OTP_EXPIRY_MINUTES = 5;
    
    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        OtpData otpData = new OtpData(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpStorage.put(email, otpData);
        return otp;
    }
    
    public boolean validateOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        
        if (otpData == null) {
            throw new BadRequestException("OTP not found");
        }
        
        if (otpData.expiryTime.isBefore(LocalDateTime.now())) {
            otpStorage.remove(email);
            throw new BadRequestException("OTP expired");
        }
        
        if (!otpData.otp.equals(otp)) {
            throw new BadRequestException("Invalid OTP");
        }
        
        return true;
    }
    
    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
    
    private record OtpData(String otp, LocalDateTime expiryTime) {}
}
package com.Startup.Ecommerce.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.name}")
    private String appName;
    
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your " + appName + " Verification OTP");
        message.setText("Your OTP for verification is: " + otp + "\nThis OTP will expire in 5 minutes.");
        
        mailSender.send(message);
    }
    
    public void sendPasswordResetOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset OTP - " + appName);
        message.setText("Your OTP for password reset is: " + otp + "\nThis OTP will expire in 5 minutes.");
        
        mailSender.send(message);
    }
}
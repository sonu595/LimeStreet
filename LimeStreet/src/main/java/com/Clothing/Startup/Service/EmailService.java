package com.Clothing.Startup.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom("shadow.pentest1899@gmail.com");  
        
        message.setTo(toEmail);
        message.setSubject("🔐 LimeStreet - Login OTP");
        
        String emailBody = """
               
               ╔════════════════════════════════╗
               ║     LIME STREET CLOTHING       ║
               ║        LOGIN VERIFICATION       ║
               ╚════════════════════════════════╝
               
               Hello,
               
               Your One-Time Password (OTP) is:
               
               ┌─────────────────────────┐
               │                         │
               │        %s               │
               │                         │
               └─────────────────────────┘
               
                Valid for: 5 minutes only
                Don't share this OTP with anyone
               
               Regards,
               LimeStreet Team
               """.formatted(otp);
        
        message.setText(emailBody);
        mailSender.send(message);
        
        System.out.println("✅ OTP sent successfully to: " + toEmail);
    }
}
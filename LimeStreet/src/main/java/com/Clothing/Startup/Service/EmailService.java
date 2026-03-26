package com.Clothing.Startup.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Value("${MAIL_FROM:${MAIL_USERNAME:no-reply@limestreet.shop}}")
    private String fromAddress;
    
    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom(fromAddress);
        
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

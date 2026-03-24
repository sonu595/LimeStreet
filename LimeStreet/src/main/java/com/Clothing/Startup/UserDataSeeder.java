package com.Clothing.Startup;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.Clothing.Startup.Model.User;
import com.Clothing.Startup.Repository.UserRepository;

@Configuration
public class UserDataSeeder {

    private static final String DEFAULT_ADMIN_EMAIL = "sonusinghshekhawat1899@gmail.com";

    @Bean
    CommandLineRunner seedDefaultAdmin(UserRepository userRepository) {
        return args -> {
            User admin = userRepository.findByEmail(DEFAULT_ADMIN_EMAIL).orElseGet(User::new);

            admin.setName("Default Admin");
            admin.setEmail(DEFAULT_ADMIN_EMAIL);
            admin.setPassword("OTP_LOGIN_ONLY");
            admin.setProvider("OTP");
            admin.setRole("ADMIN");

            userRepository.save(admin);
        };
    }
}

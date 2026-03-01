package com.Startup.Ecommerce.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Startup.Ecommerce.Models.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByResetPasswordToken(String token);
    Optional<User> findByRefreshToken(String refreshToken);
}
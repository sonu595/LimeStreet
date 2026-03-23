package com.Clothing.Startup.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
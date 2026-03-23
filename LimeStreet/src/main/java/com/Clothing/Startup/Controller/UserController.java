package com.Clothing.Startup.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Clothing.Startup.Model.User;
import com.Clothing.Startup.Repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository repo;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return repo.save(user);
    }

    @GetMapping
    public List<User> allUsers(){
        return repo.findAll();
    }
    
    @PostMapping("/login")
    public String login(@RequestBody User user){
        User dbUser = repo.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // OTP verify
        if ("OTP".equals(dbUser.getProvider())) {
            throw new RuntimeException("Please login with OTP");
        }

        if (user.getPassword().equals(dbUser.getPassword())) {
            return "Login successful";
        } else {
            throw new RuntimeException("Invalid Password");
        }
    }
}

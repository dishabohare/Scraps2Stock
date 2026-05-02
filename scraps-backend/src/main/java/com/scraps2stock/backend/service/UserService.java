package com.scraps2stock.backend.service;

import com.scraps2stock.backend.model.User;
import com.scraps2stock.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(User user) {
        User existing = userRepository.findByEmail(user.getEmail());

        if (existing != null) {
            throw new RuntimeException("Email already registered");
        }

        // Normalize role to uppercase so backend permission checks always match
        if (user.getRole() != null) {
            String normalizedRole = user.getRole()
                    .replaceAll("(?i)^ROLE_", "")
                    .toUpperCase();
            user.setRole(normalizedRole);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUserProfile(String email, String newName, String newPhone) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setName(newName);
        user.setPhone(newPhone);

        return userRepository.save(user);
    }

    public User updateUserName(String email, String newName) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setName(newName);
        return userRepository.save(user);
    }

    public User resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
package com.scraps2stock.backend.controller;

import java.util.Map;
import com.scraps2stock.backend.dto.AuthResponse;
import com.scraps2stock.backend.model.User;
import com.scraps2stock.backend.security.JwtUtil;
import com.scraps2stock.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);

            AuthResponse response = new AuthResponse(
                    null,
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    savedUser.getRole(),
                    savedUser.getPhone());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> data) {
        try {
            String email = data.get("email");
            String password = data.get("password");

            User user = userService.resetPassword(email, password);

            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody User updated) {
        try {
            String token = JwtUtil.extractTokenFromHeader(authHeader);
            String email = JwtUtil.extractEmail(token);

            User savedUser = userService.updateUserProfile(
                    email,
                    updated.getName(),
                    updated.getPhone());

            AuthResponse response = new AuthResponse(
                    null,
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    savedUser.getRole(),
                    savedUser.getPhone());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User existing = userService.loginUser(user.getEmail(), user.getPassword());

            String token = JwtUtil.generateToken(existing.getEmail());

            AuthResponse response = new AuthResponse(
                    token,
                    existing.getId(),
                    existing.getName(),
                    existing.getEmail(),
                    existing.getRole(),
                    existing.getPhone());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
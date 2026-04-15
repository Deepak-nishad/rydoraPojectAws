package com.rydora.controller;

import com.rydora.dto.*;
import com.rydora.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(
                authService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(
                authService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }
    
 // TEMPORARY - just to generate bcrypt hash
 // DELETE THIS after getting the hash
 @GetMapping("/generate-hash/{password}")
 public String generateHash(@PathVariable String password) {
     return passwordEncoder.encode(password);
 }
 
}

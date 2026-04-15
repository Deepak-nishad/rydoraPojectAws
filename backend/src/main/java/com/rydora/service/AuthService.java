package com.rydora.service;

import com.rydora.dto.*;
import com.rydora.model.*;
import com.rydora.repository.*;
import com.rydora.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER
    @Transactional
    public ResponseEntity<String> register(RegisterRequest request) {

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                "Email already registered. Please login.");
        }

        // Create user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole().toUpperCase());
        user.setPassword(
            passwordEncoder.encode(request.getPassword()));

        // Set vehicle details if role is USER
        if (request.getRole().equalsIgnoreCase("USER")) {
            user.setVehicleNumber(request.getVehicleNumber());
            user.setVehicleType(request.getVehicleType());
        }

        User savedUser = userRepository.save(user);

        // If DRIVER - create driver profile
        if (request.getRole().equalsIgnoreCase("DRIVER")) {
            Driver driver = new Driver();
            driver.setUser(savedUser);
            driver.setLicenseNumber(request.getLicenseNumber());
            driver.setExperience(request.getExperience());
            driver.setApprovalStatus("PENDING");
            driverRepository.save(driver);
        }


//        return   "Registration successful";
        return ResponseEntity.ok("Registration successful");
       
    }

  
 // ✅ LOGIN
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                new RuntimeException("Email not found"));
        
        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // If driver - check approval status
        if (user.getRole().equals("DRIVER")) {
            Driver driver = driverRepository
                .findByUser(user)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Driver profile not found"));

            if (driver.getApprovalStatus().equals("PENDING")) {
                throw new RuntimeException(
                    "Your account is pending admin approval.");
            }

            if (driver.getApprovalStatus().equals("REJECTED")) {
                throw new RuntimeException(
                    "Your account has been rejected by admin.");
            }
        }

        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole(),
            user.getUserId()
        );

        return new AuthResponse(
            token,
            user.getRole(),
            user.getName(),
            user.getUserId(),
            "Login successful"
        );
    }
 

}

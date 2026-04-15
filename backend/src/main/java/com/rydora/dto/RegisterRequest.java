package com.rydora.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter valid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String address;

    // USER or DRIVER
    @NotBlank(message = "Role is required")
    private String role;

    // User vehicle details
    private String vehicleNumber;
    private String vehicleType;

    // Driver specific fields
    private String licenseNumber;
    private int experience;
}

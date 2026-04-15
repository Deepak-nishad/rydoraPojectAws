package com.rydora.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    private String address;

    // User owns the vehicle
    private String vehicleNumber;
    private String vehicleType;

    // USER, DRIVER, ADMIN
    @Column(nullable = false)
    private String role;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.rydora.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    // Every driver is also a user
    @OneToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(nullable = false)
    private String licenseNumber;

    private int experience;

    private double rating = 0.0;

    private int totalTrips = 0;

    // PENDING, APPROVED, REJECTED
    @Column(nullable = false)
    private String approvalStatus = "PENDING";
}

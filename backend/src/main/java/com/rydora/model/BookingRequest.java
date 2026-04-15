package com.rydora.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "driverId", nullable = false)
    private Driver driver;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate fromDate;

    @Column(nullable = false)
    private LocalDate toDate;

    // PENDING, ACCEPTED, REJECTED, CANCELLED
    @Column(nullable = false)
    private String status = "PENDING";

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.rydora.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "driverId", nullable = false)
    private Driver driver;

    // User can only review after trip completed
    @OneToOne
    @JoinColumn(name = "bookingId", nullable = false)
    private Booking booking;

    // 1 to 5
    @Column(nullable = false)
    private int rating;

    private String comment;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

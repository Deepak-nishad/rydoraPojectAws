package com.rydora.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @OneToOne
    @JoinColumn(name = "requestId")
    private BookingRequest request;

    @ManyToOne
    @JoinColumn(name = "driverId")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    private LocalDate fromDate;
    private LocalDate toDate;

    // Driver fills these during trip
    private Double startKm;
    private Double endKm;
    private Double totalKm;
    private Double fare;

    // Fixed rate ₹10 per km
    private Double ratePerKm = 10.0;

    // BOOKED, TRIP_STARTED, COMPLETED, CANCELLED
    @Column(nullable = false)
    private String status = "BOOKED";
}

package com.rydora.controller;

import com.rydora.dto.*;
import com.rydora.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // DRIVER starts trip - enters start KM
    @PutMapping("/{id}/start-trip")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> startTrip(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody TripStartDTO dto) {
        try {
            return ResponseEntity.ok(
                bookingService.startTrip(
                    auth.getName(), id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // DRIVER ends trip - enters end KM
    // Fare auto calculated here
    @PutMapping("/{id}/end-trip")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> endTrip(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody TripEndDTO dto) {
        try {
            return ResponseEntity.ok(
                bookingService.endTrip(
                    auth.getName(), id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // USER sees their bookings
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyBookings(
                                Authentication auth) {
        try {
            return ResponseEntity.ok(
                bookingService.getUserBookings(
                    auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // DRIVER sees their bookings
    @GetMapping("/driver-bookings")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> getDriverBookings(
                                Authentication auth) {
        try {
            return ResponseEntity.ok(
                bookingService.getDriverBookings(
                    auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }
}

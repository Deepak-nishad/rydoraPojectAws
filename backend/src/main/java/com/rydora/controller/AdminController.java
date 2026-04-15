package com.rydora.controller;

import com.rydora.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ADMIN dashboard stats
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboard() {
        try {
            return ResponseEntity.ok(
                adminService.getDashboard());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // ADMIN views all users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(
                adminService.getAllUsers());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // ADMIN views all drivers
    @GetMapping("/drivers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDrivers() {
        try {
            return ResponseEntity.ok(
                adminService.getAllDrivers());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // ADMIN views pending drivers
    @GetMapping("/drivers/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingDrivers() {
        try {
            return ResponseEntity.ok(
                adminService.getPendingDrivers());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // ADMIN approves a driver
    @PutMapping("/drivers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveDriver(
                                @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                adminService.approveDriver(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // ADMIN rejects a driver
    @PutMapping("/drivers/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectDriver(
                                @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                adminService.rejectDriver(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // ADMIN views all bookings
    @GetMapping("/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBookings() {
        try {
            return ResponseEntity.ok(
                adminService.getAllBookings());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }
}

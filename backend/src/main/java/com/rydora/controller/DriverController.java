package com.rydora.controller;

import com.rydora.dto.*;
import com.rydora.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    // USER searches available drivers by date
    @PostMapping("/available")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAvailableDrivers(
            @Valid @RequestBody AvailabilityRequest request) {
        try {
            List<AvailableDriverDTO> drivers =
                driverService.getAvailableDrivers(request);

            if (drivers.isEmpty()) {
                return ResponseEntity.ok(
                    "No drivers available for selected dates");
            }
            return ResponseEntity.ok(drivers);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // DRIVER sees own profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> getProfile(
                                Authentication auth) {
        try {
            return ResponseEntity.ok(
                driverService.getDriverProfile(
                    auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // Get driver by ID - public
    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(
                                @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                driverService.getDriverById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }
}

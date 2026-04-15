package com.rydora.controller;

import com.rydora.dto.*;
import com.rydora.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    // USER sends request to a driver
    @PostMapping("/send")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendRequest(
            Authentication auth,
            @Valid @RequestBody SendRequestDTO dto) {
        try {
            return ResponseEntity.ok(
                requestService.sendRequest(
                    auth.getName(), dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // USER sees all their requests
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyRequests(
                                Authentication auth) {
        try {
            return ResponseEntity.ok(
                requestService.getUserRequests(
                    auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // DRIVER sees pending requests
    @GetMapping("/pending")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> getPendingRequests(
                                Authentication auth) {
        try {
            return ResponseEntity.ok(
                requestService.getDriverPendingRequests(
                    auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // DRIVER accepts a request
    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> acceptRequest(
            Authentication auth,
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                requestService.acceptRequest(
                    auth.getName(), id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // DRIVER rejects a request
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> rejectRequest(
            Authentication auth,
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                requestService.rejectRequest(
                    auth.getName(), id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // USER cancels a request
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> cancelRequest(
            Authentication auth,
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                requestService.cancelRequest(
                    auth.getName(), id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }
}

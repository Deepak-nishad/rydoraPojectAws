package com.rydora.controller;

import com.rydora.dto.*;
import com.rydora.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // USER adds review after completed trip
    @PostMapping("/add/{bookingId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addReview(
            Authentication auth,
            @PathVariable Long bookingId,
            @Valid @RequestBody AddReviewDTO dto) {
        try {
            return ResponseEntity.ok(
                reviewService.addReview(
                    auth.getName(), bookingId, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // Get all reviews of a driver - public
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getDriverReviews(
                        @PathVariable Long driverId) {
        try {
            return ResponseEntity.ok(
                reviewService.getDriverReviews(driverId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }

    // USER sees reviews they have given
    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyReviews(
                                Authentication auth) {
        try {
            return ResponseEntity.ok(
                reviewService.getMyReviews(auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                 .body(e.getMessage());
        }
    }
}

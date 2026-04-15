package com.rydora.service;

import com.rydora.dto.*;
import com.rydora.model.*;
import com.rydora.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    // ✅ USER ADDS REVIEW AFTER COMPLETED TRIP
    @Transactional
    public ReviewResponseDTO addReview(
            String userEmail,
            Long bookingId,
            AddReviewDTO dto) {

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        Booking booking = bookingRepository
            .findById(bookingId)
            .orElseThrow(() ->
                new RuntimeException("Booking not found"));

        // Must be user's own booking
        if (!booking.getUser().getUserId()
                    .equals(user.getUserId())) {
            throw new RuntimeException(
                "You can only review your own trips");
        }

        // Trip must be completed
        if (!booking.getStatus().equals("COMPLETED")) {
            throw new RuntimeException(
                "You can only review after trip is completed");
        }

        // Cannot review twice
        if (reviewRepository.existsByBooking(booking)) {
            throw new RuntimeException(
                "You already reviewed this trip");
        }

        Review review = new Review();
        review.setUser(user);
        review.setDriver(booking.getDriver());
        review.setBooking(booking);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        Review saved = reviewRepository.save(review);

        // Update driver average rating
        updateDriverRating(booking.getDriver());

        return convertToDTO(saved);
    }

    // ✅ GET ALL REVIEWS OF A DRIVER
    public List<ReviewResponseDTO> getDriverReviews(
                                        Long driverId) {
        Driver driver = driverRepository
            .findById(driverId)
            .orElseThrow(() ->
                new RuntimeException("Driver not found"));

        return reviewRepository
            .findByDriverOrderByCreatedAtDesc(driver)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // ✅ USER SEES REVIEWS THEY GAVE
    public List<ReviewResponseDTO> getMyReviews(
                                    String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        return reviewRepository
            .findByUserOrderByCreatedAtDesc(user)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // ---- Update driver average rating ----
    private void updateDriverRating(Driver driver) {
        Double avg = reviewRepository
            .findAverageRatingByDriver(driver);

        if (avg != null) {
            driver.setRating(
                Math.round(avg * 10.0) / 10.0);
            driverRepository.save(driver);
        }
    }

    // ---- Convert to DTO ----
    private ReviewResponseDTO convertToDTO(Review r) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setReviewId(r.getReviewId());
        dto.setUserName(r.getUser().getName());
        dto.setDriverName(r.getDriver().getUser().getName());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setSource(r.getBooking().getRequest().getSource());
        dto.setDestination(
            r.getBooking().getRequest().getDestination());
        return dto;
    }
}

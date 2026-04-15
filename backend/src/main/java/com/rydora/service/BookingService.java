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
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private FareCalculatorService fareCalculator;

    @Autowired
    private RequestService requestService;

    // ✅ DRIVER STARTS TRIP
    @Transactional
    public BookingResponseDTO startTrip(
            String driverEmail,
            Long bookingId,
            TripStartDTO dto) {

        Booking booking = bookingRepository
            .findById(bookingId)
            .orElseThrow(() ->
                new RuntimeException("Booking not found"));

        if (!booking.getDriver().getUser()
                    .getEmail().equals(driverEmail)) {
            throw new RuntimeException("Not authorized");
        }

        if (!booking.getStatus().equals("BOOKED")) {
            throw new RuntimeException(
                "Trip already started or completed");
        }

        booking.setStartKm(dto.getStartKm());
        booking.setStatus("TRIP_STARTED");

        return requestService.convertToBookingDTO(
            bookingRepository.save(booking));
    }

    // ✅ DRIVER ENDS TRIP - fare auto calculated
    @Transactional
    public BookingResponseDTO endTrip(
            String driverEmail,
            Long bookingId,
            TripEndDTO dto) {

        Booking booking = bookingRepository
            .findById(bookingId)
            .orElseThrow(() ->
                new RuntimeException("Booking not found"));

        if (!booking.getDriver().getUser()
                    .getEmail().equals(driverEmail)) {
            throw new RuntimeException("Not authorized");
        }

        if (!booking.getStatus().equals("TRIP_STARTED")) {
            throw new RuntimeException(
                "Trip has not started yet");
        }

        // Calculate fare: (endKm - startKm) x 10
        double fare = fareCalculator.calculateFare(
            booking.getStartKm(), dto.getEndKm());

        double totalKm = fareCalculator.getTotalKm(
            booking.getStartKm(), dto.getEndKm());

        booking.setEndKm(dto.getEndKm());
        booking.setTotalKm(totalKm);
        booking.setFare(fare);
        booking.setStatus("COMPLETED");

        // Increment driver total trips
        Driver driver = booking.getDriver();
        driver.setTotalTrips(driver.getTotalTrips() + 1);
        driverRepository.save(driver);

        return requestService.convertToBookingDTO(
            bookingRepository.save(booking));
    }

    // ✅ USER SEES THEIR BOOKINGS
    public List<BookingResponseDTO> getUserBookings(
                                        String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        return bookingRepository
            .findByUserOrderByBookingIdDesc(user)
            .stream()
            .map(requestService::convertToBookingDTO)
            .collect(Collectors.toList());
    }

    // ✅ DRIVER SEES THEIR BOOKINGS
    public List<BookingResponseDTO> getDriverBookings(
                                    String driverEmail) {
        User user = userRepository.findByEmail(driverEmail)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        Driver driver = driverRepository.findByUser(user)
            .orElseThrow(() ->
                new RuntimeException("Driver not found"));

        return bookingRepository
            .findByDriverOrderByBookingIdDesc(driver)
            .stream()
            .map(requestService::convertToBookingDTO)
            .collect(Collectors.toList());
    }
}

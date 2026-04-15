package com.rydora.service;

import com.rydora.dto.*;
import com.rydora.model.*;
import com.rydora.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    @Autowired
    private BookingRequestRepository requestRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    // ✅ USER SENDS REQUEST TO DRIVER
    @Transactional
    public RequestResponseDTO sendRequest(
                String userEmail, SendRequestDTO dto) {

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        Driver driver = driverRepository
            .findById(dto.getDriverId())
            .orElseThrow(() ->
                new RuntimeException("Driver not found"));

        // Validate dates
        if (dto.getFromDate().isBefore(LocalDate.now())) {
            throw new RuntimeException(
                "From date cannot be in the past");
        }

        if (dto.getToDate().isBefore(dto.getFromDate())) {
            throw new RuntimeException(
                "To date must be after from date");
        }

        // Check duplicate request
        if (requestRepository
                .existsByUserAndDriverAndFromDateAndToDate(
                    user, driver,
                    dto.getFromDate(), dto.getToDate())) {
            throw new RuntimeException(
                "You already sent a request to this driver " +
                "for same dates");
        }

        BookingRequest request = new BookingRequest();
        request.setUser(user);
        request.setDriver(driver);
        request.setSource(dto.getSource());
        request.setDestination(dto.getDestination());
        request.setFromDate(dto.getFromDate());
        request.setToDate(dto.getToDate());
        request.setStatus("PENDING");

        return convertToRequestDTO(
            requestRepository.save(request));
    }

    // ✅ USER SEES ALL THEIR REQUESTS
    public List<RequestResponseDTO> getUserRequests(
                                        String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        return requestRepository
            .findByUserOrderByCreatedAtDesc(user)
            .stream()
            .map(this::convertToRequestDTO)
            .collect(Collectors.toList());
    }

    // ✅ DRIVER SEES PENDING REQUESTS
    public List<RequestResponseDTO> getDriverPendingRequests(
                                        String driverEmail) {
        User user = userRepository.findByEmail(driverEmail)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        Driver driver = driverRepository.findByUser(user)
            .orElseThrow(() ->
                new RuntimeException("Driver not found"));

        return requestRepository
            .findByDriverAndStatus(driver, "PENDING")
            .stream()
            .map(this::convertToRequestDTO)
            .collect(Collectors.toList());
    }

    // ✅ DRIVER ACCEPTS REQUEST
    @Transactional
    public BookingResponseDTO acceptRequest(
                String driverEmail, Long requestId) {

        BookingRequest request = requestRepository
            .findById(requestId)
            .orElseThrow(() ->
                new RuntimeException("Request not found"));

        if (!request.getDriver().getUser()
                    .getEmail().equals(driverEmail)) {
            throw new RuntimeException(
                "Not authorized to accept this request");
        }

        if (!request.getStatus().equals("PENDING")) {
            throw new RuntimeException(
                "Request is no longer pending");
        }

        // Accept this request
        request.setStatus("ACCEPTED");
        requestRepository.save(request);

        // Create booking
        Booking booking = new Booking();
        booking.setRequest(request);
        booking.setDriver(request.getDriver());
        booking.setUser(request.getUser());
        booking.setFromDate(request.getFromDate());
        booking.setToDate(request.getToDate());
        booking.setStatus("BOOKED");
        booking.setRatePerKm(10.0);

        Booking savedBooking = bookingRepository.save(booking);

        // Auto reject all overlapping pending requests
        List<BookingRequest> overlapping =
            requestRepository.findOverlappingPendingRequests(
                request.getDriver(),
                request.getFromDate(),
                request.getToDate()
            );

        for (BookingRequest r : overlapping) {
            if (!r.getRequestId()
                   .equals(request.getRequestId())) {
                r.setStatus("REJECTED");
                requestRepository.save(r);
            }
        }

        return convertToBookingDTO(savedBooking);
    }

    // ✅ DRIVER REJECTS REQUEST
    @Transactional
    public String rejectRequest(
                String driverEmail, Long requestId) {

        BookingRequest request = requestRepository
            .findById(requestId)
            .orElseThrow(() ->
                new RuntimeException("Request not found"));

        if (!request.getDriver().getUser()
                    .getEmail().equals(driverEmail)) {
            throw new RuntimeException(
                "Not authorized");
        }

        if (!request.getStatus().equals("PENDING")) {
            throw new RuntimeException(
                "Request is no longer pending");
        }

        request.setStatus("REJECTED");
        requestRepository.save(request);
        return "Request rejected";
    }

    // ✅ USER CANCELS REQUEST
    @Transactional
    public String cancelRequest(
                String userEmail, Long requestId) {

        BookingRequest request = requestRepository
            .findById(requestId)
            .orElseThrow(() ->
                new RuntimeException("Request not found"));

        if (!request.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException(
                "Not authorized");
        }

        if (!request.getStatus().equals("PENDING")) {
            throw new RuntimeException(
                "Cannot cancel a " +
                request.getStatus().toLowerCase() +
                " request");
        }

        request.setStatus("CANCELLED");
        requestRepository.save(request);
        return "Request cancelled";
    }

    // ---- Helpers ----

    public RequestResponseDTO convertToRequestDTO(
                                    BookingRequest r) {
        RequestResponseDTO dto = new RequestResponseDTO();
        dto.setRequestId(r.getRequestId());
        dto.setUserId(r.getUser().getUserId());
        dto.setUserName(r.getUser().getName());
        dto.setUserPhone(r.getUser().getPhone());
        dto.setUserVehicleNumber(r.getUser().getVehicleNumber());
        dto.setUserVehicleType(r.getUser().getVehicleType());
        dto.setDriverId(r.getDriver().getDriverId());
        dto.setDriverName(r.getDriver().getUser().getName());
        dto.setDriverPhone(r.getDriver().getUser().getPhone());
        dto.setSource(r.getSource());
        dto.setDestination(r.getDestination());
        dto.setFromDate(r.getFromDate());
        dto.setToDate(r.getToDate());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    public BookingResponseDTO convertToBookingDTO(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(b.getBookingId());
        dto.setUserName(b.getUser().getName());
        dto.setUserPhone(b.getUser().getPhone());
        dto.setUserVehicleNumber(b.getUser().getVehicleNumber());
        dto.setUserVehicleType(b.getUser().getVehicleType());
        dto.setUserAddress(b.getUser().getAddress());
        dto.setDriverName(b.getDriver().getUser().getName());
        dto.setDriverPhone(b.getDriver().getUser().getPhone());
        dto.setLicenseNumber(b.getDriver().getLicenseNumber());
        dto.setSource(b.getRequest().getSource());
        dto.setDestination(b.getRequest().getDestination());
        dto.setFromDate(b.getFromDate());
        dto.setToDate(b.getToDate());
        dto.setStartKm(b.getStartKm());
        dto.setEndKm(b.getEndKm());
        dto.setTotalKm(b.getTotalKm());
        dto.setFare(b.getFare());
        dto.setRatePerKm(b.getRatePerKm());
        dto.setStatus(b.getStatus());
        return dto;
    }
}

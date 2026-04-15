package com.rydora.service;

import com.rydora.dto.*;
import com.rydora.model.*;
import com.rydora.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ GET AVAILABLE DRIVERS BY DATE RANGE
    public List<AvailableDriverDTO> getAvailableDrivers(
                            AvailabilityRequest request) {

        if (request.getFromDate().isBefore(
                java.time.LocalDate.now())) {
            throw new RuntimeException(
                "From date cannot be in the past");
        }

        if (request.getToDate().isBefore(
                request.getFromDate())) {
            throw new RuntimeException(
                "To date must be after from date");
        }

        // Find drivers already booked in date range
        List<Long> bookedDriverIds =
            bookingRepository.findBookedDriverIds(
                request.getFromDate(),
                request.getToDate()
            );

        // Get all APPROVED drivers not in booked list
        List<Driver> availableDrivers =
            driverRepository.findAll()
                .stream()
                .filter(d -> d.getApprovalStatus()
                              .equals("APPROVED"))
                .filter(d -> !bookedDriverIds
                              .contains(d.getDriverId()))
                .collect(Collectors.toList());

        return availableDrivers.stream()
            .map(this::convertToAvailableDTO)
            .collect(Collectors.toList());
    }

    // ✅ GET DRIVER PROFILE
    public DriverProfileDTO getDriverProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException("User not found"));

        Driver driver = driverRepository.findByUser(user)
            .orElseThrow(() ->
                new RuntimeException(
                    "Driver profile not found"));

        return convertToProfileDTO(driver);
    }

    // ✅ GET DRIVER BY ID
    public DriverProfileDTO getDriverById(Long driverId) {
        Driver driver = driverRepository
            .findById(driverId)
            .orElseThrow(() ->
                new RuntimeException("Driver not found"));

        return convertToProfileDTO(driver);
    }

    // ---- Helpers ----

    public AvailableDriverDTO convertToAvailableDTO(
                                        Driver driver) {
        AvailableDriverDTO dto = new AvailableDriverDTO();
        dto.setDriverId(driver.getDriverId());
        dto.setName(driver.getUser().getName());
        dto.setPhone(driver.getUser().getPhone());
        dto.setLicenseNumber(driver.getLicenseNumber());
        dto.setExperience(driver.getExperience());
        dto.setRating(driver.getRating());
        dto.setTotalTrips(driver.getTotalTrips());
        return dto;
    }

    public DriverProfileDTO convertToProfileDTO(Driver driver) {
        DriverProfileDTO dto = new DriverProfileDTO();
        dto.setDriverId(driver.getDriverId());
        dto.setName(driver.getUser().getName());
        dto.setEmail(driver.getUser().getEmail());
        dto.setPhone(driver.getUser().getPhone());
        dto.setLicenseNumber(driver.getLicenseNumber());
        dto.setExperience(driver.getExperience());
        dto.setRating(driver.getRating());
        dto.setTotalTrips(driver.getTotalTrips());
        dto.setApprovalStatus(driver.getApprovalStatus());
        return dto;
    }
}

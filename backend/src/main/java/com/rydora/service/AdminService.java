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
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DriverService driverService;

    @Autowired
    private RequestService requestService;

    // ✅ ADMIN DASHBOARD COUNTS
    public AdminDashboardDTO getDashboard() {
        long totalUsers = userRepository.findAll()
            .stream()
            .filter(u -> u.getRole().equals("USER"))
            .count();

        long totalDrivers = driverRepository.count();

        long pendingApprovals = driverRepository
            .findByApprovalStatus("PENDING").size();

        long totalBookings = bookingRepository.count();

        long activeTrips = bookingRepository
            .countByStatus("TRIP_STARTED");

        long completedTrips = bookingRepository
            .countByStatus("COMPLETED");

        return new AdminDashboardDTO(
            totalUsers,
            totalDrivers,
            pendingApprovals,
            totalBookings,
            activeTrips,
            completedTrips
        );
    }

    // ✅ GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .filter(u -> u.getRole().equals("USER"))
            .collect(Collectors.toList());
    }

    // ✅ GET ALL DRIVERS
    public List<DriverProfileDTO> getAllDrivers() {
        return driverRepository.findAll()
            .stream()
            .map(driverService::convertToProfileDTO)
            .collect(Collectors.toList());
    }

    // ✅ GET PENDING DRIVERS
    public List<DriverProfileDTO> getPendingDrivers() {
        return driverRepository
            .findByApprovalStatus("PENDING")
            .stream()
            .map(driverService::convertToProfileDTO)
            .collect(Collectors.toList());
    }

    // ✅ APPROVE DRIVER
    @Transactional
    public DriverProfileDTO approveDriver(Long driverId) {
        Driver driver = driverRepository
            .findById(driverId)
            .orElseThrow(() ->
                new RuntimeException("Driver not found"));

        driver.setApprovalStatus("APPROVED");
        driverRepository.save(driver);

        return driverService.convertToProfileDTO(driver);
    }

    // ✅ REJECT DRIVER
    @Transactional
    public DriverProfileDTO rejectDriver(Long driverId) {
        Driver driver = driverRepository
            .findById(driverId)
            .orElseThrow(() ->
                new RuntimeException("Driver not found"));

        driver.setApprovalStatus("REJECTED");
        driverRepository.save(driver);

        return driverService.convertToProfileDTO(driver);
    }

    // ✅ GET ALL BOOKINGS
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
            .stream()
            .map(requestService::convertToBookingDTO)
            .collect(Collectors.toList());
    }
}

package com.rydora.repository;

import com.rydora.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository
                    extends JpaRepository<Booking, Long> {

    // Find booked driverIds overlapping with date range
    @Query("SELECT b.driver.driverId FROM Booking b " +
           "WHERE b.status IN ('BOOKED', 'TRIP_STARTED') " +
           "AND NOT (b.toDate < :fromDate " +
           "OR b.fromDate > :toDate)")
    List<Long> findBookedDriverIds(
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );

    // All bookings for a user
    List<Booking> findByUserOrderByBookingIdDesc(User user);

    // All bookings for a driver
    List<Booking> findByDriverOrderByBookingIdDesc(Driver driver);

    // Count by status - for admin dashboard
    long countByStatus(String status);
}

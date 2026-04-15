package com.rydora.repository;

import com.rydora.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRequestRepository
                    extends JpaRepository<BookingRequest, Long> {

    // All requests made by a user
    List<BookingRequest> findByUserOrderByCreatedAtDesc(User user);

    // All pending requests for a specific driver
    List<BookingRequest> findByDriverAndStatus(
                            Driver driver, String status);

    // All requests for a specific driver (any status)
    List<BookingRequest> findByDriverOrderByCreatedAtDesc(
                            Driver driver);

    // Find overlapping PENDING requests for same driver
    // Used to auto-reject after one is accepted
    @Query("SELECT r FROM BookingRequest r " +
           "WHERE r.driver = :driver " +
           "AND r.status = 'PENDING' " +
           "AND NOT (r.toDate < :fromDate " +
           "OR r.fromDate > :toDate)")
    List<BookingRequest> findOverlappingPendingRequests(
        @Param("driver") Driver driver,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );

    // Check duplicate request
    boolean existsByUserAndDriverAndFromDateAndToDate(
        User user,
        Driver driver,
        LocalDate fromDate,
        LocalDate toDate
    );
}

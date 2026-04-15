package com.rydora.repository;

import com.rydora.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository
                    extends JpaRepository<Review, Long> {

    List<Review> findByDriverOrderByCreatedAtDesc(Driver driver);

    List<Review> findByUserOrderByCreatedAtDesc(User user);

    boolean existsByBooking(Booking booking);

    @Query("SELECT AVG(r.rating) FROM Review r " +
           "WHERE r.driver = :driver")
    Double findAverageRatingByDriver(
                        @Param("driver") Driver driver);
}

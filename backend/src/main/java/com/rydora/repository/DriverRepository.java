package com.rydora.repository;

import com.rydora.model.Driver;
import com.rydora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DriverRepository
                    extends JpaRepository<Driver, Long> {

    Optional<Driver> findByUser(User user);

    // All drivers with a specific approval status
    List<Driver> findByApprovalStatus(String approvalStatus);
}

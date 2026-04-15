package com.rydora.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalDrivers;
    private long pendingApprovals;
    private long totalBookings;
    private long activeTrips;
    private long completedTrips;
}

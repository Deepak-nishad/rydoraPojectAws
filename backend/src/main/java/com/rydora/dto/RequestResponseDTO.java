package com.rydora.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestResponseDTO {
    private Long requestId;
    private Long userId;
    private String userName;
    private String userPhone;
    private String userVehicleNumber;
    private String userVehicleType;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private String source;
    private String destination;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String status;
    private LocalDateTime createdAt;
}

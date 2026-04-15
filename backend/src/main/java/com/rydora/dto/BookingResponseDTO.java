package com.rydora.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long bookingId;
    private String userName;
    private String userPhone;
    private String userVehicleNumber;
    private String userVehicleType;
    private String userAddress;
    private String driverName;
    private String driverPhone;
    private String licenseNumber;
    private String source;
    private String destination;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Double startKm;
    private Double endKm;
    private Double totalKm;
    private Double fare;
    private Double ratePerKm;
    private String status;
}

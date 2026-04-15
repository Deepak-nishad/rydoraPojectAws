package com.rydora.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableDriverDTO {
    private Long driverId;
    private String name;
    private String phone;
    private String licenseNumber;
    private int experience;
    private double rating;
    private int totalTrips;
}

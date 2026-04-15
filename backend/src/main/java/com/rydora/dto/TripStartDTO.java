package com.rydora.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripStartDTO {

    @NotNull(message = "Start KM is required")
    @Positive(message = "Start KM must be positive")
    private Double startKm;
}

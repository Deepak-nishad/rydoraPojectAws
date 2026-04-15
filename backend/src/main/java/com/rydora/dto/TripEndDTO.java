package com.rydora.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripEndDTO {

    @NotNull(message = "End KM is required")
    @Positive(message = "End KM must be positive")
    private Double endKm;
}

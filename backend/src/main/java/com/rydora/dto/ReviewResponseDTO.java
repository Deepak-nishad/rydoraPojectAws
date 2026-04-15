package com.rydora.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long reviewId;
    private String userName;
    private String driverName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private String source;
    private String destination;
}

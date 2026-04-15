package com.rydora.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private Long userId;
    private String message;
}

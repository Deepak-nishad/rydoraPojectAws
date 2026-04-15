package com.rydora.service;

import org.springframework.stereotype.Service;

@Service
public class FareCalculatorService {

    // Fixed rate for all vehicles
    private static final double RATE_PER_KM = 10.0;

    // Fare = (endKm - startKm) x 10
    public double calculateFare(double startKm,
                                 double endKm) {
        if (endKm <= startKm) {
            throw new RuntimeException(
                "End KM must be greater than Start KM");
        }
        double totalKm = endKm - startKm;
        return Math.round(totalKm * RATE_PER_KM * 100.0) / 100.0;
    }

    // Get total km
    public double getTotalKm(double startKm, double endKm) {
        return endKm - startKm;
    }

    // Get fixed rate
    public double getRate() {
        return RATE_PER_KM;
    }
}

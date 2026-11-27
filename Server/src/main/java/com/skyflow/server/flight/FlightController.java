package com.skyflow.server.flight;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightRepository flightRepository;

    public FlightController(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @GetMapping
    public ResponseEntity<List<Flight>> getFlights(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String airline,
            @RequestParam(required = false) String status) {

        String f = (from != null && !from.isBlank()) ? from.trim() : null;
        String t = (to != null && !to.isBlank()) ? to.trim() : null;
        String a = (airline != null && !airline.isBlank())
                ? airline.trim() : null;
        String s = (status != null && !status.isBlank())
                ? status.trim() : null;

        if (f == null && t == null && a == null && s == null) {
            return ResponseEntity.ok(flightRepository.findAll());
        }

        return ResponseEntity.ok(
            flightRepository.filterFlights(f, t, a, s)
        );
    }

    @GetMapping("/{flightNumber}")
    public ResponseEntity<Flight> getFlightByNumber(
            @PathVariable String flightNumber) {
        return flightRepository
                .findByFlightNumberIgnoreCase(flightNumber.trim())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

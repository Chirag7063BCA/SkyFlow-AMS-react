package com.skyflow.server.airport;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

    private final AirportRepository airportRepository;

    public AirportController(AirportRepository airportRepository) {
        this.airportRepository = airportRepository;
    }

    @GetMapping
    public ResponseEntity<List<Airport>> getAirports(
            @RequestParam(required = false) String query) {
        if (query != null && !query.isBlank()) {
            return ResponseEntity.ok(
                airportRepository.searchAirports(query.trim())
            );
        }
        return ResponseEntity.ok(airportRepository.findAll());
    }

    @GetMapping("/{iata}")
    public ResponseEntity<Airport> getAirportByIata(
            @PathVariable String iata) {
        return airportRepository.findByIataIgnoreCase(iata.trim())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

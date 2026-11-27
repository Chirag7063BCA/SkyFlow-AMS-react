package com.skyflow.server.flight;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumberIgnoreCase(String flightNumber);

    List<Flight> findByFromAirportCodeIgnoreCaseAndToAirportCodeIgnoreCase(
            String fromAirportCode, String toAirportCode);

    List<Flight> findByFromAirportCodeIgnoreCase(String fromAirportCode);

    List<Flight> findByToAirportCodeIgnoreCase(String toAirportCode);

    List<Flight> findByStatusIgnoreCase(String status);

    @Query("SELECT f FROM Flight f WHERE " +
           "(:from IS NULL OR LOWER(f.fromAirportCode) = LOWER(:from)) AND " +
           "(:to IS NULL OR LOWER(f.toAirportCode) = LOWER(:to)) AND " +
           "(:airline IS NULL OR " +
           " LOWER(f.airline) LIKE LOWER(CONCAT('%', :airline, '%'))) AND " +
           "(:status IS NULL OR LOWER(f.status) = LOWER(:status))")
    List<Flight> filterFlights(@Param("from") String from,
                               @Param("to") String to,
                               @Param("airline") String airline,
                               @Param("status") String status);
}

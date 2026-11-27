package com.skyflow.server.airport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {

    Optional<Airport> findByIataIgnoreCase(String iata);

    @Query("SELECT a FROM Airport a WHERE " +
           "LOWER(a.city) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(a.iata) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Airport> searchAirports(@Param("query") String query);
}

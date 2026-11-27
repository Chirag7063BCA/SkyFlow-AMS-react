package com.skyflow.server.flight;

import jakarta.persistence.*;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String flightNumber;

    @Column(nullable = false)
    private String airline;

    @Column(nullable = false)
    private String originCity;

    @Column(nullable = false)
    private String destinationCity;

    @Column(nullable = false, length = 30)
    private String departureTime;

    @Column(nullable = false, length = 30)
    private String arrivalTime;

    @Column(length = 30)
    private String duration;

    @Column(nullable = false, length = 10)
    private String fromAirportCode;

    @Column(nullable = false, length = 10)
    private String toAirportCode;

    @Column(nullable = false)
    private Boolean nonStop = true;

    @Column(length = 50)
    private String status = "Scheduled";

    @Column(length = 30)
    private String fare;

    public Flight() {}

    public Flight(String flightNumber, String airline,
                  String originCity, String destinationCity,
                  String departureTime, String arrivalTime,
                  String duration, String fromAirportCode,
                  String toAirportCode, Boolean nonStop,
                  String status, String fare) {
        this.flightNumber = flightNumber;
        this.airline = airline;
        this.originCity = originCity;
        this.destinationCity = destinationCity;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.fromAirportCode = fromAirportCode;
        this.toAirportCode = toAirportCode;
        this.nonStop = nonStop != null ? nonStop : true;
        this.status = (status != null && !status.isBlank())
                ? status : "Scheduled";
        this.fare = fare;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }

    public String getOriginCity() { return originCity; }
    public void setOriginCity(String originCity) {
        this.originCity = originCity;
    }

    public String getDestinationCity() { return destinationCity; }
    public void setDestinationCity(String destinationCity) {
        this.destinationCity = destinationCity;
    }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getFromAirportCode() { return fromAirportCode; }
    public void setFromAirportCode(String fromAirportCode) {
        this.fromAirportCode = fromAirportCode;
    }

    public String getToAirportCode() { return toAirportCode; }
    public void setToAirportCode(String toAirportCode) {
        this.toAirportCode = toAirportCode;
    }

    public Boolean getNonStop() { return nonStop; }
    public void setNonStop(Boolean nonStop) { this.nonStop = nonStop; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFare() { return fare; }
    public void setFare(String fare) { this.fare = fare; }
}

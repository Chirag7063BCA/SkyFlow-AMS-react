package com.skyflow.server.airport;

import jakarta.persistence.*;

@Entity
@Table(name = "airports")
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false, length = 10)
    private String iata;

    @Column(length = 10)
    private String icao;

    private Double latitude;
    private Double longitude;

    @Column(length = 50)
    private String type;

    public Airport() {}

    public Airport(String name, String city, String country,
                   String iata, String icao, Double latitude,
                   Double longitude, String type) {
        this.name = name;
        this.city = city;
        this.country = country;
        this.iata = iata;
        this.icao = icao;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getIata() { return iata; }
    public void setIata(String iata) { this.iata = iata; }

    public String getIcao() { return icao; }
    public void setIcao(String icao) { this.icao = icao; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}

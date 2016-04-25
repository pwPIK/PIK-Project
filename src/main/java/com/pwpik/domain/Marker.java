package com.pwpik.domain;

import javax.persistence.*;

@Entity
@Table(name = "MARKERS")
public class Marker {

    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private Float latitude;

    @Column(nullable = false)
    private Float longitude;

    public Marker() {}

    public Marker(Float latitude, Float longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Float getLongitude() {
        return longitude;
    }

    public Float getLatitude() {
        return latitude;
    }

}

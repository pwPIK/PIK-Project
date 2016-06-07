package com.pwpik.domain;

import javax.persistence.*;

@Entity
@Table(name = "MARKERS")
public class Marker {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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

    public Marker copy() {
        return new Marker(this.latitude, this.longitude);
    }

    @Override
    public boolean equals(Object obj) {
        if(!obj.getClass().equals(Marker.class))
            return false;
        Marker m = (Marker)obj;
        return Float.compare(this.latitude, m.latitude) == 0
               && Float.compare(this.longitude, m.longitude) == 0;
    }
}

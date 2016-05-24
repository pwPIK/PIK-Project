package com.pwpik.domain;

import javax.persistence.*;

@Entity
@Table(name = "STASHES")
public class Stash {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    private Marker marker;

    @Column
    private String description;

    public Stash() {}

    public Stash(Marker marker, String description) {
        this.marker = marker;
        this.description = description;
    }

    public Marker getMarker() {
        return marker;
    }

    public String getDescription() {
        return description;
    }

}
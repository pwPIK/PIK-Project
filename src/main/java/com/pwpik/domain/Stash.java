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

    @Column
    private boolean visited;

    public Stash() {}

    public Stash(Marker marker, String description) {
        this.marker = marker;
        this.description = description;
        this.visited = false;
    }

    public Stash(Marker marker, String description, short visited) {
        this.marker = marker;
        this.description = description;
        this.visited = true;
    }

    public Long getId() { return id; }

    public Marker getMarker() {
        return marker;
    }

    public String getDescription() {
        return description;
    }

    public boolean isVisited() {
        return visited;
    }
}
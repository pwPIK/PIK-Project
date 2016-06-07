package com.pwpik.domain;

import org.junit.Test;

import static org.junit.Assert.*;

public class MarkerTest {

    final float DELTA = 0.00001f;

    @Test
    public void latitude_getter() {
        Marker m1 = new Marker(1.15f, 2.78f);
        assertEquals( 1.15f, m1.getLatitude().floatValue(), DELTA );
    }

    @Test
    public void longitude_getter() {
        Marker m1 = new Marker(1.15f, 2.78f);
        assertEquals( 2.78f, m1.getLongitude().floatValue(), DELTA );
    }

    @Test
    public void equality_of_markers() {
        Marker m1 = new Marker(1.15f, 2.78f),
               m2 = new Marker(1.15f, 2.78f);
        assertTrue( m1.equals(m2) );
    }

    @Test
    public void inequality_of_marker_and_different_class_object() {
        Marker m1 = new Marker(1.15f, 2.78f);
        assertFalse( m1.equals(Integer.valueOf(1)) );
    }

}
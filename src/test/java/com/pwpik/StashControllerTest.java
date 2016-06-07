package com.pwpik;

import com.pwpik.domain.Marker;
import com.pwpik.domain.Stash;
import com.pwpik.web.StashController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Collection;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
public class StashControllerTest {

    @Autowired
    private StashController controller;

    @Test
    public void receive_and_store_stashes() {
        assertEquals(2, controller.getAll().size());
        Stash toSave = new Stash(new Marker(1.2f, 3.4f), "Test description");
        controller.store(toSave);
        assertEquals(3, controller.getAll().size());
    }

    @Test
    public void edit_stash() {
        final Stash alreadyStored = getIthStash(1);
        assertTrue(alreadyStored.isVisited());
        final Stash editedStash = new Stash(alreadyStored.getMarker().copy(),
                                            "Test description");
        controller.edit(editedStash);
        final Stash edited = getIthStash(1);
        assertFalse(edited.isVisited());
    }

    Stash getIthStash(int id) {
        return (Stash)(controller.getAll().toArray()[id]);
    }

}
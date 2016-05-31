package com.pwpik;

import com.pwpik.domain.Marker;
import com.pwpik.domain.Stash;
import com.pwpik.repository.StashRepository;
import com.pwpik.web.StashController;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
public class StashControllerTest {

    @Autowired
    private StashController controller;

    @Test
    public void get_all_stashes() {
        Stash stashes[] = controller.displayFirst().toArray(new Stash[2]);
        assertEquals("First stash with Edam", stashes[0].getDescription());
        assertEquals("Second stash with Gouda", stashes[1].getDescription());
        assertEquals(false, stashes[0].isVisited());
        assertEquals(true, stashes[1].isVisited());
    }

    @Test
    public void new_stash_is_stored() {
        int initialStashesAmount = controller.displayFirst().size();
        controller.store(new Stash(new Marker(1.17f, 2.89f), "Test entry"));
        int afterStorageNumber = controller.displayFirst().size();
        assertEquals(1, afterStorageNumber - initialStashesAmount);
    }

}
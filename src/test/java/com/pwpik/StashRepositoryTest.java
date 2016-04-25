package com.pwpik;

import com.pwpik.domain.Stash;
import com.pwpik.repository.StashRepository;
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
public class StashRepositoryTest {

    @Autowired
    private StashRepository repository;

    @Test
    public void get_all_stashes() {
        Stash stashes[] = repository.findAll().toArray(new Stash[2]);
        assertEquals("First stash with Edam", stashes[0].getDescription());
        assertEquals("Second stash with Gouda", stashes[1].getDescription());
    }

}
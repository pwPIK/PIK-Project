package com.pwpik.service;

import com.pwpik.domain.Stash;
import com.pwpik.repository.StashRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.Collection;
import java.util.Iterator;

@Service
public class StashService {

    private final StashRepository repository;

    @Autowired
    public StashService(StashRepository repository) {
        this.repository = repository;
    }

    public Collection<Stash> getAllStashes() {
        return repository.findAll();
    }

    public void storeNewStash(Stash stash) {
        repository.save(stash);
    }

    public void editStash(Stash stashToUpdate) {
        Collection<Stash> stashes = getAllStashes();

        for(Stash stash : stashes) {
            if(stash.getMarker().equals(stashToUpdate.getMarker())) {
                repository.delete(stash);
                repository.save(stashToUpdate);
            }
        }
    }
}
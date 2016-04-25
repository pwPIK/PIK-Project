package com.pwpik.service;

import com.pwpik.domain.Stash;
import com.pwpik.repository.StashRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

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

}
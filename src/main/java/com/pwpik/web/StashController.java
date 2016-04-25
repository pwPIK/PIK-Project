package com.pwpik.web;

import com.pwpik.domain.Stash;
import com.pwpik.service.StashService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
public class StashController {

    private final StashService service;

    @Autowired
    StashController(StashService service) {
        this.service = service;
    }

    @RequestMapping(value = "/display")
    public Collection<Stash> displayFirst() {
        return service.getAllStashes();
    }

}

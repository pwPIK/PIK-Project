package com.pwpik.web;

import com.pwpik.domain.Stash;
import com.pwpik.service.StashService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public Collection<Stash> getAll() {
        return service.getAllStashes();
    }

    @RequestMapping(value = "/store")
    public void store(@RequestBody Stash stash) {
        service.storeNewStash(stash);
    }

    @RequestMapping(value = "/edit")
    public void edit(@RequestBody Stash stash) {
        service.editStash(stash);
    }

}

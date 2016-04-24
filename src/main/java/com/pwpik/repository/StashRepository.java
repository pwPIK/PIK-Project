package com.pwpik.repository;

import com.pwpik.domain.Stash;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface StashRepository extends CrudRepository<Stash, Integer> {

    Collection<Stash> findAll();

}
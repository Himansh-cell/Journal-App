package com.tutorial.journalApp.repository;

import com.tutorial.journalApp.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User,String> {
    User findByUsername(String userName);
    void deleteByUsername(String username);
}

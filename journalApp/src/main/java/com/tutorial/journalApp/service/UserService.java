package com.tutorial.journalApp.service;

import com.tutorial.journalApp.entity.User;

import com.tutorial.journalApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAll(){
        return userRepository.findAll();
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    @Autowired
    private PasswordEncoder passwordEncoder;
    public void saveNewUser(User user){
        user.setPassword(
                passwordEncoder.encode(user.getPassword()));
        user.setRoles(List.of("USER"));
        userRepository.save(user);
    }

    public void saveUser(User user){
        user.setRoles(List.of("USER"));
        userRepository.save(user);
    }

    public void saveAdmin(User user){
        user.setPassword(
                passwordEncoder.encode(user.getPassword()));
        user.setRoles(List.of("USER","ADMIN"));
        userRepository.save(user);
    }


    public void deleteByUsername(String username){
         userRepository.deleteByUsername(username);
    }


    public User updateByUsername(String username , User user){
        User oldEntry = userRepository.findById(username).orElse(null);
        if (oldEntry != null) {
            oldEntry.setUsername(user.getUsername());
            oldEntry.setPassword(user.getPassword());
            return userRepository.save(oldEntry);
        }
        return null;
    }
}

package com.tutorial.journalApp.controller;

import com.tutorial.journalApp.entity.User;
import com.tutorial.journalApp.service.UserService;
import com.tutorial.journalApp.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private WeatherService weatherService;

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping("/weather")
    public ResponseEntity<String> greeting() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            int feelsLike = weatherService.getFeelsLike("Mumbai");
            return new ResponseEntity<>(
                    "Hi " + username + ", weather in Mumbai feels like " + feelsLike + "°C",
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{username}")
    public User getByUsername(@PathVariable String username) {
        return userService.getByUsername(username);
    }


    @DeleteMapping
    public ResponseEntity<?>  deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
       userService.deleteByUsername(username);
       return new  ResponseEntity<>(HttpStatus.NO_CONTENT);
   }

    @PutMapping
    public ResponseEntity<?> updateUser( @RequestBody User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       String username = authentication.getName();
        User userInDb = userService.getByUsername(username);
        if(userInDb != null){
            userInDb.setUsername(user.getUsername());
            userInDb.setPassword(user.getPassword());
        userService.saveNewUser(userInDb);
       return new  ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}

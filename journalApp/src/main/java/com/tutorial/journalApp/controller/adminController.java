package com.tutorial.journalApp.controller;

import com.tutorial.journalApp.cache.AppCache;
import com.tutorial.journalApp.entity.User;
import com.tutorial.journalApp.service.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class adminController {

    @Autowired
    UserService userService;

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers(){
        List<User>list = userService.getAll();
        if(list != null && !list.isEmpty()){
         return  new ResponseEntity<>(list, HttpStatus.OK);
        }
        return  new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/create-admin-user")
    public void createUser(@RequestBody User user){
        userService.saveAdmin(user);
    }

    @Autowired
    AppCache appCache;
    @GetMapping("/clear-app-cache")
    public void clearAppCache(){
       appCache.init()  ;
    }
}

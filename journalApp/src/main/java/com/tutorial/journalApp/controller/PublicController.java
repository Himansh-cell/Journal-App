package com.tutorial.journalApp.controller;

import com.tutorial.journalApp.entity.User;
import com.tutorial.journalApp.service.CustomUserDetailsService;
import com.tutorial.journalApp.service.UserService;
import com.tutorial.journalApp.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
 @RequestMapping("/public")
public class PublicController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
            private JwtUtil jwtUtil;

    @Autowired
    UserService userService;

    @PostMapping("/sign-up")
    public void createUser(@RequestBody User user) {
        userService.saveNewUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
     try {
         authenticationManager.authenticate(
                 new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

         String jwt = jwtUtil.generateToken(user.getUsername());
         return new ResponseEntity<>(jwt, HttpStatus.OK);
     }catch(Exception e){
log.error("Exception occured while createAuthenticationToken",e );
return new ResponseEntity<>("Incorrect username or password", HttpStatus.BAD_REQUEST);
        }
     }
}

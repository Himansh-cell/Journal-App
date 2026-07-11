package com.tutorial.journalApp.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET =
            "my-super-secret-key-that-is-long-enough-1234567890!@#";

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    private final long EXPIRATION_TIME =
            1000 * 60 * 60; // 1 hour


    // Generate JWT
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }


    // Extract username from JWT
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }


    // Extract all claims
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    // Validate JWT
    public boolean validateToken(String username,
                                 UserDetails userDetails,
                                 String token) {

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }


    // Check expiration
    private boolean isTokenExpired(String token) {
        return extractClaims(token)
                .getExpiration()
                .before(new Date());
    }
}





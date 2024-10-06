package com.prathameshShubham.bharatBijliCorporation.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);  // Use a secure key

    public static String generateToken(String userId , String role) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))  // 1 hour validity
                .signWith(SECRET_KEY)
                .compact();
    }

    public static String generateRefreshToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days expiry
                .signWith(SECRET_KEY)
                .compact();
    }

    public static Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static String extractRole(String token) {
        return extractClaims(token).get("role", String.class);  // Extract role from claims
    }

    public static boolean validateToken(String token, String userId) {
        String tokenUserId = extractClaims(token).getSubject();
        return userId.equals(tokenUserId) && !isTokenExpired(token);
    }

    private static boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
}

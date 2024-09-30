package com.prathameshShubham.bharatBijliCorporation.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/auth/")) {
            filterChain.doFilter(request, response); // Proceed without processing JWT
            return;
        }

//        String jwtToken = extractTokenFromCookies(request.getCookies());
        String jwtToken = extractTokenFromAuthorizationHeader(request.getHeader("Authorization"));

        String userId = JwtUtil.extractClaims(jwtToken).getSubject();  // Extract user ID from token

        if (JwtUtil.validateToken(jwtToken, userId)) {  // Validate token
            String role = JwtUtil.extractRole(jwtToken);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, getRoleAuth(role) );
            SecurityContextHolder.getContext().setAuthentication(authentication);  // Set authentication
        }

        filterChain.doFilter(request, response);  // Continue the filter chain
    }

    public Collection< ? extends GrantedAuthority> getRoleAuth(String role){
        return Arrays.asList(new SimpleGrantedAuthority(role));
    }

    private String extractTokenFromCookies(Cookie[] cookies) {
        if(cookies != null) {
            for(Cookie cookie : cookies) {
                if(cookie.getName().equals("jwt")) {
                   return cookie.getValue();
                }
            }
        }
        return null;
    }

    private String extractTokenFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }

}


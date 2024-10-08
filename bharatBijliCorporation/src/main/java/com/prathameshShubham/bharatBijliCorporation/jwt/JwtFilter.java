package com.prathameshShubham.bharatBijliCorporation.jwt;

import com.prathameshShubham.bharatBijliCorporation.config.CookieAuthenticationFilter;
import com.prathameshShubham.bharatBijliCorporation.constants.SecurityConstants;
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

import static com.prathameshShubham.bharatBijliCorporation.constants.SecurityConstants.JWT_COOKIE_NAME;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/auth/")) {
            filterChain.doFilter(request, response); // Proceed without processing JWT
            return;
        }

        String jwtToken = extractTokenFromCookies(request.getCookies());
//        String jwtToken = extractTokenFromAuthHeader(request.getHeader("Authorization"));

        String userId = JwtUtil.extractClaims(jwtToken).getSubject();  // Extract user ID from token

        if (JwtUtil.validateToken(jwtToken, userId)) {
            String role = JwtUtil.extractRole(jwtToken);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, getRoleAuth(role) );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    public Collection< ? extends GrantedAuthority> getRoleAuth(String role){
        return Arrays.asList(new SimpleGrantedAuthority(role));
    }

    private String extractTokenFromCookies(Cookie[] cookies) {
        if(cookies != null) {
            for(Cookie cookie : cookies) {
                if(cookie.getName().equals(JWT_COOKIE_NAME)) {
                   return cookie.getValue();
                }
            }
        }
        return null;
    }

    private String extractTokenFromAuthHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }

}


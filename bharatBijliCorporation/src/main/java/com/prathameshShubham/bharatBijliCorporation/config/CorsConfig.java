package com.prathameshShubham.bharatBijliCorporation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig  {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST","PUT","DELETE"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        corsConfiguration.setAllowCredentials(true);        // allow cookies, authorization headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",corsConfiguration);         // apply to all endpoints

        return source;
    }
}

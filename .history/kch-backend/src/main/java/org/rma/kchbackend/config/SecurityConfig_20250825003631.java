package org.rma.kchbackend.config;

import org.rma.kchbackend.service.CustomUserDetailsService;
import org.rma.kchbackend.util.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .cors().configurationSource(corsConfigurationSource)
                .and()
                .csrf().disable()
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // Public endpoints - must come FIRST
                        .requestMatchers("/vehicle/test-public", "/vehicle/test-form", "/vehicle/request-keycode-public").permitAll()
                        .requestMatchers("/", "/actuator/health", "/css/**", "/js/**", "/images/**", "/register", "/send-email", "/makes/**", "/compliance/status", "/compliance/status/public").permitAll()
                        .requestMatchers("/auth/login", "/auth/register", "/auth/admin-register", "/auth/refresh", "/auth/dev-set-password", "/auth/dev-upsert-admin", "/auth/dev-upsert-user", "/auth/reset-password", "/auth/reset-password/confirm").permitAll()
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/chat/stream", "/chat/history", "/chat/send").hasAnyRole("BASEUSER", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/super-admin/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/user/**", "/keycode-user/**", "/api/v1/keycodes/**", "/api/payments/**").hasAnyRole("BASEUSER", "ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/cart/**", "/api/payments/**").hasAnyRole("BASEUSER", "ADMIN", "SUPER_ADMIN", "GUEST") // Allow guest users to access cart and payments
                        .requestMatchers("/vehicle/**").hasAnyRole("BASEUSER", "ADMIN", "SUPER_ADMIN") // Other vehicle endpoints require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .logoutSuccessUrl("/auth/login")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager customAuthenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder())
                .and().build();
    }
}
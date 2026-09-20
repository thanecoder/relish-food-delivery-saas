package com.relish.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Shell config for M2: stateless, CSRF off (no cookie-based session to protect), and closed by
 * default — only the health check is public. JWT bearer-token validation (the OAuth2 resource
 * server piece) and role-based authorization rules are wired in M4 alongside the OTP auth
 * endpoints; there is nothing to authenticate against yet.
 */
@Configuration
class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/actuator/health").permitAll()
				.anyRequest().authenticated());
		return http.build();
	}

}

package com.relish.auth;

import com.relish.user.Role;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

@Service
class JwtService {

	// same secret signs and verifies both token types, this app is its own issuer + resource server
	static final String TOKEN_TYPE_CLAIM = "token_type";

	private final JwtEncoder jwtEncoder;
	private final JwtDecoder jwtDecoder;
	private final int accessTtlMinutes;
	private final int refreshTtlDays;

	JwtService(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder,
			@Value("${relish.jwt.access-ttl-minutes}") int accessTtlMinutes,
			@Value("${relish.jwt.refresh-ttl-days}") int refreshTtlDays) {
		this.jwtEncoder = jwtEncoder;
		this.jwtDecoder = jwtDecoder;
		this.accessTtlMinutes = accessTtlMinutes;
		this.refreshTtlDays = refreshTtlDays;
	}

	String issueAccessToken(UUID userId, String email, Role role) {
		return issue(userId, email, role, "access", Duration.ofMinutes(accessTtlMinutes));
	}

	String issueRefreshToken(UUID userId, String email, Role role) {
		return issue(userId, email, role, "refresh", Duration.ofDays(refreshTtlDays));
	}

	long accessTtlSeconds() {
		return Duration.ofMinutes(accessTtlMinutes).toSeconds();
	}

	long refreshTtlSeconds() {
		return Duration.ofDays(refreshTtlDays).toSeconds();
	}

	private String issue(UUID userId, String email, Role role, String tokenType, Duration ttl) {
		Instant now = Instant.now();
		JwtClaimsSet claims = JwtClaimsSet.builder()
			.issuer("relish")
			.issuedAt(now)
			.expiresAt(now.plus(ttl))
			.subject(userId.toString())
			.claim("email", email)
			.claim("role", List.of(role.name()))
			.claim(TOKEN_TYPE_CLAIM, tokenType)
			.build();
		JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
		return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
	}

	/** Decodes a refresh token and makes sure its not actually an access token being reused. */
	Jwt decodeRefreshToken(String token) {
		Jwt jwt = jwtDecoder.decode(token);
		if (!"refresh".equals(jwt.getClaimAsString(TOKEN_TYPE_CLAIM))) {
			throw new JwtException("not a refresh token");
		}
		return jwt;
	}

}

package com.relish.auth;

import com.relish.user.Role;
import com.relish.user.UserStatus;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
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

	// same secret signs and verifies every token type, this app is its own issuer + resource server
	static final String TOKEN_TYPE_CLAIM = "token_type";

	private static final String ACCESS = "access";
	private static final String REFRESH = "refresh";
	private static final String REGISTRATION = "registration";

	private final JwtEncoder jwtEncoder;
	private final JwtDecoder jwtDecoder;
	private final int accessTtlMinutes;
	private final int refreshTtlDays;
	private final int registrationTtlMinutes;

	JwtService(JwtEncoder jwtEncoder, @Qualifier("internalJwtDecoder") JwtDecoder jwtDecoder,
			@Value("${relish.jwt.access-ttl-minutes}") int accessTtlMinutes,
			@Value("${relish.jwt.refresh-ttl-days}") int refreshTtlDays,
			@Value("${relish.jwt.registration-ttl-minutes}") int registrationTtlMinutes) {
		this.jwtEncoder = jwtEncoder;
		this.jwtDecoder = jwtDecoder;
		this.accessTtlMinutes = accessTtlMinutes;
		this.refreshTtlDays = refreshTtlDays;
		this.registrationTtlMinutes = registrationTtlMinutes;
	}

	String issueAccessToken(UUID userId, String email, Role role, UserStatus status) {
		return issueForUser(userId, email, role, status, ACCESS, Duration.ofMinutes(accessTtlMinutes));
	}

	String issueRefreshToken(UUID userId, String email, Role role, UserStatus status) {
		return issueForUser(userId, email, role, status, REFRESH, Duration.ofDays(refreshTtlDays));
	}

	/**
	 * Proof that whoever holds it controls the inbox, nothing more - theres no account behind it yet.
	 * Short lived on purpose, its only meant to survive reading the terms.
	 */
	String issueRegistrationToken(String email) {
		Instant now = Instant.now();
		return encode(baseClaims(now, Duration.ofMinutes(registrationTtlMinutes))
			.subject(email)
			.claim(TOKEN_TYPE_CLAIM, REGISTRATION)
			.build());
	}

	long accessTtlSeconds() {
		return Duration.ofMinutes(accessTtlMinutes).toSeconds();
	}

	long refreshTtlSeconds() {
		return Duration.ofDays(refreshTtlDays).toSeconds();
	}

	long registrationTtlSeconds() {
		return Duration.ofMinutes(registrationTtlMinutes).toSeconds();
	}

	/** Decodes a refresh token and makes sure its not actually some other token being reused. */
	Jwt decodeRefreshToken(String token) {
		return decodeOfType(token, REFRESH);
	}

	/** Same idea, and the subject here is the verified email rather than a user id. */
	Jwt decodeRegistrationToken(String token) {
		return decodeOfType(token, REGISTRATION);
	}

	private Jwt decodeOfType(String token, String expectedType) {
		Jwt jwt = jwtDecoder.decode(token);
		if (!expectedType.equals(jwt.getClaimAsString(TOKEN_TYPE_CLAIM))) {
			throw new JwtException("not a " + expectedType + " token");
		}
		return jwt;
	}

	private String issueForUser(UUID userId, String email, Role role, UserStatus status, String tokenType,
			Duration ttl) {
		Instant now = Instant.now();
		return encode(baseClaims(now, ttl)
			.subject(userId.toString())
			.claim("email", email)
			.claim("role", List.of(role.name()))
			.claim("status", status.name())
			.claim(TOKEN_TYPE_CLAIM, tokenType)
			.build());
	}

	private JwtClaimsSet.Builder baseClaims(Instant now, Duration ttl) {
		return JwtClaimsSet.builder()
			.issuer("relish")
			.issuedAt(now)
			.expiresAt(now.plus(ttl));
	}

	private String encode(JwtClaimsSet claims) {
		JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
		return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
	}

}

package com.relish.auth;

import com.relish.common.ConflictException;
import com.relish.common.ForbiddenException;
import com.relish.user.User;
import com.relish.user.UserService;
import com.relish.user.UserStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
class OtpController {

	private static final String REFRESH_COOKIE = "relish_refresh";

	private final OtpService otpService;
	private final UserService userService;
	private final JwtService jwtService;

	OtpController(OtpService otpService, UserService userService, JwtService jwtService) {
		this.otpService = otpService;
		this.userService = userService;
		this.jwtService = jwtService;
	}

	// deliberately gives away nothing about whether the email is known, thats the whole point
	@PostMapping("/otp/request")
	ResponseEntity<Void> requestOtp(@Valid @RequestBody OtpRequestRequest request, HttpServletRequest httpRequest) {
		otpService.requestOtp(request.email(), clientIp(httpRequest));
		return ResponseEntity.ok().build();
	}

	@PostMapping("/otp/verify")
	ResponseEntity<OtpVerifyResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request,
			HttpServletRequest httpRequest) {
		OtpVerifyResult result = otpService.verifyOtp(request.email(), request.code(), clientIp(httpRequest));
		switch (result) {
			case EXPIRED -> throw new ConflictException("That code has expired, request a new one.");
			case TOO_MANY_ATTEMPTS -> throw new ConflictException("Too many attempts for this code, request a new one.");
			case WRONG_CODE -> throw new ConflictException("That code isnt right.");
			case VALID -> { /* carry on below */ }
		}

		Optional<User> existing = userService.findByEmail(request.email());
		if (existing.isEmpty()) {
			// code checked out, so the inbox is theirs - but nothing gets created until they've read
			// the terms. Consent gets its own screen instead of riding along on this request.
			String token = jwtService.issueRegistrationToken(request.email());
			return ResponseEntity.ok(OtpVerifyResponse.registrationRequired(token, jwtService.registrationTtlSeconds()));
		}

		User user = existing.get();
		requireLoginAllowed(user);
		return asOutcome(newSession(user));
	}

	@PostMapping("/register")
	ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		Jwt token = jwtService.decodeRegistrationToken(request.registrationToken());
		String email = token.getSubject();

		// a double click or a second tab would otherwise replay the token straight into a unique key violation
		User user = userService.findByEmail(email)
			.orElseGet(() -> userService.createCustomer(email, Instant.now()));
		requireLoginAllowed(user);
		return newSession(user);
	}

	@PostMapping("/refresh")
	ResponseEntity<AuthResponse> refresh(@CookieValue(name = REFRESH_COOKIE, required = false) String refreshCookie) {
		if (refreshCookie == null) {
			return ResponseEntity.status(401).build();
		}
		Jwt jwt = jwtService.decodeRefreshToken(refreshCookie);
		User user = userService.getById(UUID.fromString(jwt.getSubject()));
		requireLoginAllowed(user);
		return newSession(user);
	}

	@GetMapping("/me")
	ResponseEntity<AuthResponse> me(@AuthenticationPrincipal Jwt jwt) {
		User user = userService.getById(UUID.fromString(jwt.getSubject()));
		return ResponseEntity.ok(new AuthResponse(null, 0, user.getEmail(), user.getName(), user.getRole().name(),
			user.getStatus().name()));
	}

	@PostMapping("/logout")
	ResponseEntity<Void> logout() {
		ResponseCookie cleared = ResponseCookie.from(REFRESH_COOKIE, "")
			.httpOnly(true).sameSite("Strict").path("/api/v1/auth").maxAge(0).build();
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cleared.toString()).build();
	}

	private void requireLoginAllowed(User user) {
		if (user.getStatus() == UserStatus.SUSPENDED) {
			throw new ForbiddenException("This account has been suspended. Get in touch with support.");
		}
		if (user.getStatus() == UserStatus.REJECTED) {
			throw new ForbiddenException("This application was not approved. Get in touch with support.");
		}
	}

	/** Same session, just announced as one of the two things a verify can end in. */
	private ResponseEntity<OtpVerifyResponse> asOutcome(ResponseEntity<AuthResponse> session) {
		return ResponseEntity.ok()
			.headers(session.getHeaders())
			.body(OtpVerifyResponse.session(session.getBody()));
	}

	private ResponseEntity<AuthResponse> newSession(User user) {
		String accessToken = jwtService.issueAccessToken(user.getId(), user.getEmail(), user.getRole(),
			user.getStatus());
		String refreshToken = jwtService.issueRefreshToken(user.getId(), user.getEmail(), user.getRole(),
			user.getStatus());

		ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, refreshToken)
			.httpOnly(true)
			.sameSite("Strict")
			.path("/api/v1/auth")
			.maxAge(jwtService.refreshTtlSeconds())
			// no Secure flag - this runs over plain http locally, see architecture notes
			.build();

		AuthResponse body = new AuthResponse(accessToken, jwtService.accessTtlSeconds(), user.getEmail(),
			user.getName(), user.getRole().name(), user.getStatus().name());
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(body);
	}

	private String clientIp(HttpServletRequest request) {
		String forwarded = request.getHeader("X-Real-IP");
		return forwarded != null ? forwarded : request.getRemoteAddr();
	}

}

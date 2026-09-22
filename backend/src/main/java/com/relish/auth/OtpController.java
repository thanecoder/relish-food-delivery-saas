package com.relish.auth;

import com.relish.common.ConflictException;
import com.relish.user.User;
import com.relish.user.UserService;
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

	@PostMapping("/otp/request")
	ResponseEntity<Void> requestOtp(@Valid @RequestBody OtpRequestRequest request, HttpServletRequest httpRequest) {
		otpService.requestOtp(request.email(), clientIp(httpRequest));
		return ResponseEntity.ok().build();
	}

	@PostMapping("/otp/verify")
	ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
		otpService.verifyOtp(request.email(), request.code());

		Optional<User> existing = userService.findByEmail(request.email());
		if (existing.isPresent()) {
			return withNewSession(existing.get());
		}

		// brand new email - no account gets created without consent, even though the code was valid
		if (!request.acceptedTerms()) {
			throw new ConflictException("You need to accept the Terms & Conditions to create an account.");
		}
		User user = userService.createCustomer(request.email(), Instant.now());
		return withNewSession(user);
	}

	@PostMapping("/refresh")
	ResponseEntity<AuthResponse> refresh(@CookieValue(name = REFRESH_COOKIE, required = false) String refreshCookie) {
		if (refreshCookie == null) {
			return ResponseEntity.status(401).build();
		}
		Jwt jwt = jwtService.decodeRefreshToken(refreshCookie);
		User user = userService.getById(UUID.fromString(jwt.getSubject()));
		return withNewSession(user);
	}

	@GetMapping("/me")
	ResponseEntity<AuthResponse> me(@AuthenticationPrincipal Jwt jwt) {
		User user = userService.getById(UUID.fromString(jwt.getSubject()));
		return ResponseEntity.ok(new AuthResponse(null, 0, user.getEmail(), user.getName(), user.getRole().name()));
	}

	@PostMapping("/logout")
	ResponseEntity<Void> logout() {
		ResponseCookie cleared = ResponseCookie.from(REFRESH_COOKIE, "")
			.httpOnly(true).sameSite("Strict").path("/api/v1/auth").maxAge(0).build();
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cleared.toString()).build();
	}

	private ResponseEntity<AuthResponse> withNewSession(User user) {
		String accessToken = jwtService.issueAccessToken(user.getId(), user.getEmail(), user.getRole());
		String refreshToken = jwtService.issueRefreshToken(user.getId(), user.getEmail(), user.getRole());

		ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, refreshToken)
			.httpOnly(true)
			.sameSite("Strict")
			.path("/api/v1/auth")
			.maxAge(jwtService.refreshTtlSeconds())
			// no Secure flag - this runs over plain http locally, see architecture notes
			.build();

		AuthResponse body = new AuthResponse(accessToken, jwtService.accessTtlSeconds(), user.getEmail(),
			user.getName(), user.getRole().name());
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(body);
	}

	private String clientIp(HttpServletRequest request) {
		String forwarded = request.getHeader("X-Real-IP");
		return forwarded != null ? forwarded : request.getRemoteAddr();
	}

}

package com.relish.auth;

import com.relish.common.TooManyRequestsException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
class OtpService {

	private static final Logger log = LoggerFactory.getLogger(OtpService.class);
	private static final SecureRandom RANDOM = new SecureRandom();
	private static final Duration LIMIT_WINDOW = Duration.ofMinutes(15);

	private final OtpChallengeRepository otpChallengeRepository;
	private final RateLimiter rateLimiter;
	private final JavaMailSender mailSender;
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	private final int ttlMinutes;
	private final int maxAttempts;
	private final boolean logToConsole;

	OtpService(OtpChallengeRepository otpChallengeRepository, RateLimiter rateLimiter, JavaMailSender mailSender,
			@Value("${relish.otp.ttl-minutes}") int ttlMinutes,
			@Value("${relish.otp.max-attempts}") int maxAttempts,
			@Value("${relish.otp.log-to-console}") boolean logToConsole) {
		this.otpChallengeRepository = otpChallengeRepository;
		this.rateLimiter = rateLimiter;
		this.mailSender = mailSender;
		this.ttlMinutes = ttlMinutes;
		this.maxAttempts = maxAttempts;
		this.logToConsole = logToConsole;
	}

	void requestOtp(String email, String requestIp) {
		// single | on purpose - with || the ip bucket never gets charged once the email one is empty
		if (!rateLimiter.tryConsume("otp-req:" + email, 5, LIMIT_WINDOW)
				| !rateLimiter.tryConsume("otp-req-ip:" + requestIp, 20, LIMIT_WINDOW)) {
			throw new TooManyRequestsException("Too many code requests, please wait a bit and try again.",
				LIMIT_WINDOW);
		}

		otpChallengeRepository.consumeOutstanding(email, Instant.now());

		String code = String.format("%06d", RANDOM.nextInt(1_000_000));
		String hash = passwordEncoder.encode(code);
		OtpChallenge challenge = new OtpChallenge(email, hash, Instant.now().plus(Duration.ofMinutes(ttlMinutes)), requestIp);
		otpChallengeRepository.save(challenge);

		if (logToConsole) {
			log.info("OTP for {}: {}", email, code);
		}
		sendEmail(email, code);
	}

	/**
	 * Returns how the check went instead of throwing, so the attempt counter survives a wrong code.
	 * The caller turns the result into a response.
	 */
	OtpVerifyResult verifyOtp(String email, String code, String requestIp) {
		if (!rateLimiter.tryConsume("otp-vrf:" + email, 10, LIMIT_WINDOW)
				| !rateLimiter.tryConsume("otp-vrf-ip:" + requestIp, 30, LIMIT_WINDOW)) {
			throw new TooManyRequestsException("Too many attempts, please wait a bit and try again.", LIMIT_WINDOW);
		}

		OtpChallenge latest = otpChallengeRepository
			.findFirstByIdentifierAndConsumedAtIsNullOrderByCreatedAtDesc(email)
			.orElse(null);

		if (latest == null || latest.isExpired()) {
			return OtpVerifyResult.EXPIRED;
		}
		if (latest.getAttempts() >= maxAttempts) {
			return OtpVerifyResult.TOO_MANY_ATTEMPTS;
		}

		latest.registerAttempt();
		if (!passwordEncoder.matches(code, latest.getCodeHash())) {
			return OtpVerifyResult.WRONG_CODE;
		}
		latest.markConsumed();
		return OtpVerifyResult.VALID;
	}

	private void sendEmail(String email, String code) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(email);
			message.setSubject("Your Relish login code");
			message.setText("Your code is " + code + ". It expires in " + ttlMinutes + " minutes.");
			mailSender.send(message);
		} catch (Exception e) {
			// dont blow up the request just because mail is down, especially since local dev usually has no smtp
			log.warn("Could not send OTP email to {}: {}", email, e.getMessage());
		}
	}

}

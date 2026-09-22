package com.relish.auth;

import com.relish.common.ConflictException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
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
		if (!rateLimiter.tryConsume("otp-req:" + email, 5, Duration.ofMinutes(15))
				|| !rateLimiter.tryConsume("otp-req-ip:" + requestIp, 20, Duration.ofMinutes(15))) {
			throw new ConflictException("Too many OTP requests, please wait a bit and try again.");
		}

		String code = String.format("%06d", RANDOM.nextInt(1_000_000));
		String hash = passwordEncoder.encode(code);
		OtpChallenge challenge = new OtpChallenge(email, hash, Instant.now().plus(Duration.ofMinutes(ttlMinutes)), requestIp);
		otpChallengeRepository.save(challenge);

		if (logToConsole) {
			log.info("OTP for {}: {}", email, code);
		}
		sendEmail(email, code);
	}

	/** Returns true if the code was valid, throws otherwise. Doesnt create the user - the caller does that. */
	boolean verifyOtp(String email, String code) {
		List<OtpChallenge> challenges = otpChallengeRepository.findByIdentifierOrderByCreatedAtDesc(email);
		OtpChallenge latest = challenges.stream().filter(c -> !c.isConsumed()).findFirst().orElse(null);

		if (latest == null || latest.isExpired()) {
			throw new ConflictException("That code has expired, request a new one.");
		}
		if (latest.getAttempts() >= maxAttempts) {
			throw new ConflictException("Too many attempts for this code, request a new one.");
		}

		latest.registerAttempt();
		if (!passwordEncoder.matches(code, latest.getCodeHash())) {
			throw new ConflictException("That code isnt right.");
		}
		latest.markConsumed();
		return true;
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

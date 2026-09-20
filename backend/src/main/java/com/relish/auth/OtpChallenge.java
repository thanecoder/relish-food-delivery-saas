package com.relish.auth;

import com.relish.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "otp_challenges")
public class OtpChallenge extends BaseEntity {

	/** The email the code was requested for — not a FK, since a challenge may exist for an email with no User yet. */
	@Column(nullable = false)
	private String identifier;

	/** Salted hash of the 6-digit code — the plaintext code is never persisted. */
	@Column(name = "code_hash", nullable = false)
	private String codeHash;

	@Column(name = "expires_at", nullable = false)
	private Instant expiresAt;

	@Column(nullable = false)
	private int attempts;

	private Instant consumedAt;

	@Column(name = "requested_ip")
	private String requestedIp;

	protected OtpChallenge() {
	}

	public OtpChallenge(String identifier, String codeHash, Instant expiresAt, String requestedIp) {
		this.identifier = identifier;
		this.codeHash = codeHash;
		this.expiresAt = expiresAt;
		this.attempts = 0;
		this.requestedIp = requestedIp;
	}

	public String getIdentifier() {
		return identifier;
	}

	public String getCodeHash() {
		return codeHash;
	}

	public Instant getExpiresAt() {
		return expiresAt;
	}

	public boolean isExpired() {
		return Instant.now().isAfter(expiresAt);
	}

	public int getAttempts() {
		return attempts;
	}

	public void registerAttempt() {
		this.attempts++;
	}

	public Instant getConsumedAt() {
		return consumedAt;
	}

	public boolean isConsumed() {
		return consumedAt != null;
	}

	public void markConsumed() {
		this.consumedAt = Instant.now();
	}

	public String getRequestedIp() {
		return requestedIp;
	}

}

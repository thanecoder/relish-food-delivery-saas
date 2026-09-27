package com.relish.auth;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface OtpChallengeRepository extends JpaRepository<OtpChallenge, UUID> {

	Optional<OtpChallenge> findFirstByIdentifierAndConsumedAtIsNullOrderByCreatedAtDesc(String identifier);

	// asking for a new code kills whatever was outstanding, otherwise an older code stays
	// redeemable and "resend" quietly widens the window instead of replacing it
	@Modifying(clearAutomatically = true)
	@Query("update OtpChallenge c set c.consumedAt = :now where c.identifier = :identifier and c.consumedAt is null")
	void consumeOutstanding(@Param("identifier") String identifier, @Param("now") Instant now);

}

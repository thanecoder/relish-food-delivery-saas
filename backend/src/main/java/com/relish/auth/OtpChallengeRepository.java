package com.relish.auth;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface OtpChallengeRepository extends JpaRepository<OtpChallenge, UUID> {

	List<OtpChallenge> findByIdentifierOrderByCreatedAtDesc(String identifier);

}

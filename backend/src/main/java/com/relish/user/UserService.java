package com.relish.user;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {

	Optional<User> findByEmail(String email);

	User getById(UUID id);

	// only call this after consent was actually given - caller (OtpController) does the gating
	User createCustomer(String email, Instant termsAcceptedAt);

	User updateStatus(UUID id, UserStatus status);

	List<User> listActiveByRole(Role role);

}

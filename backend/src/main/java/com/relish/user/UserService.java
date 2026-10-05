package com.relish.user;

import java.time.Instant;
import java.util.Collection;
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

	// restaurant admin and delivery partner accounts in every status, for the approvals screen
	List<User> listByRoles(Collection<Role> roles);

	// the row itself - caller is responsible for clearing everything that references it first,
	// see AccountServiceImpl for the actual order that has to happen in
	void deleteAccount(UUID userId);

}

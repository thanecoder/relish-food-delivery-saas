package com.relish.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** The only way another package may read or write user data — never through {@link UserRepository} directly. */
public interface UserService {

	Optional<User> findByEmail(String email);

	User getById(UUID id);

	/** Auto-provisions a CUSTOMER on first successful OTP verify if the email isn't known yet. */
	User findOrCreateCustomer(String email);

	User updateStatus(UUID id, UserStatus status);

	List<User> listActiveByRole(Role role);

}

package com.relish.account;

import com.relish.user.User;
import java.time.Instant;

record AccountResponse(String email, String name, String role, String status, Instant memberSince) {

	static AccountResponse from(User user) {
		return new AccountResponse(user.getEmail(), user.getName(), user.getRole().name(),
			user.getStatus().name(), user.getCreatedAt());
	}

}

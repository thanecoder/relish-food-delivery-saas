package com.relish.platformadmin;

import com.relish.user.User;
import java.time.Instant;
import java.util.UUID;

record PendingUserResponse(UUID id, String email, String name, String role, Instant memberSince) {

	static PendingUserResponse from(User u) {
		return new PendingUserResponse(u.getId(), u.getEmail(), u.getName(), u.getRole().name(), u.getCreatedAt());
	}

}

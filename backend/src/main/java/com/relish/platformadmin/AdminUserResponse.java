package com.relish.platformadmin;

import com.relish.user.User;
import java.time.Instant;
import java.util.UUID;

record AdminUserResponse(UUID id, String email, String name, String role, String status, Instant memberSince) {

	static AdminUserResponse from(User u) {
		return new AdminUserResponse(u.getId(), u.getEmail(), u.getName(), u.getRole().name(),
			u.getStatus().name(), u.getCreatedAt());
	}

}

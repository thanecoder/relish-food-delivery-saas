package com.relish.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface UserRepository extends JpaRepository<User, UUID> {

	Optional<User> findByEmail(String email);

	List<User> findByRoleAndStatus(Role role, UserStatus status);

}

package com.relish.user;

import com.relish.common.NotFoundException;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	@Transactional(readOnly = true)
	public User getById(UUID id) {
		return userRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("No user with id " + id));
	}

	@Override
	public User createCustomer(String email, Instant termsAcceptedAt) {
		return userRepository.save(new User(email, email, Role.CUSTOMER, UserStatus.ACTIVE, termsAcceptedAt));
	}

	@Override
	public User updateStatus(UUID id, UserStatus status) {
		User user = getById(id);
		user.setStatus(status);
		return user;
	}

	@Override
	@Transactional(readOnly = true)
	public List<User> listActiveByRole(Role role) {
		return userRepository.findByRoleAndStatus(role, UserStatus.ACTIVE);
	}

	@Override
	@Transactional(readOnly = true)
	public List<User> listByRoles(Collection<Role> roles) {
		return userRepository.findByRoleInOrderByNameAsc(roles);
	}

	@Override
	public void deleteAccount(UUID userId) {
		userRepository.deleteById(userId);
	}

}

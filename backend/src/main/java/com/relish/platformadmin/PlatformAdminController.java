package com.relish.platformadmin;

import com.relish.common.ConflictException;
import com.relish.restaurant.RestaurantService;
import com.relish.restaurant.RestaurantStatus;
import com.relish.user.Role;
import com.relish.user.UserService;
import com.relish.user.UserStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// approval queue for the two roles that don't self-activate - restaurants and the accounts behind
// restaurants / delivery. the lists carry every status so the screen can show history too
@RestController
@RequestMapping("/api/v1/platform-admin")
@PreAuthorize("hasRole('PLATFORM_ADMIN')")
class PlatformAdminController {

	// customers and the admins themselves never go through approval
	private static final List<Role> REVIEWED_ROLES = List.of(Role.RESTAURANT_ADMIN, Role.DELIVERY_PARTNER);

	private final RestaurantService restaurantService;
	private final UserService userService;

	PlatformAdminController(RestaurantService restaurantService, UserService userService) {
		this.restaurantService = restaurantService;
		this.userService = userService;
	}

	@GetMapping("/restaurants")
	List<AdminRestaurantResponse> restaurants() {
		return restaurantService.listAll().stream().map(AdminRestaurantResponse::from).toList();
	}

	@PostMapping("/restaurants/{id}/approve")
	AdminRestaurantResponse approveRestaurant(@PathVariable UUID id) {
		if (restaurantService.getById(id).getStatus() == RestaurantStatus.APPROVED) {
			throw new ConflictException("This restaurant is already approved.");
		}
		return AdminRestaurantResponse.from(restaurantService.updateStatus(id, RestaurantStatus.APPROVED));
	}

	@PostMapping("/restaurants/{id}/reject")
	AdminRestaurantResponse rejectRestaurant(@PathVariable UUID id) {
		if (restaurantService.getById(id).getStatus() != RestaurantStatus.PENDING) {
			throw new ConflictException("Only a restaurant waiting for approval can be rejected.");
		}
		return AdminRestaurantResponse.from(restaurantService.updateStatus(id, RestaurantStatus.REJECTED));
	}

	@GetMapping("/users")
	List<AdminUserResponse> users() {
		return userService.listByRoles(REVIEWED_ROLES).stream().map(AdminUserResponse::from).toList();
	}

	@PostMapping("/users/{id}/approve")
	AdminUserResponse approveUser(@PathVariable UUID id) {
		if (userService.getById(id).getStatus() == UserStatus.ACTIVE) {
			throw new ConflictException("This account is already active.");
		}
		return AdminUserResponse.from(userService.updateStatus(id, UserStatus.ACTIVE));
	}

	@PostMapping("/users/{id}/reject")
	AdminUserResponse rejectUser(@PathVariable UUID id) {
		if (userService.getById(id).getStatus() != UserStatus.PENDING) {
			throw new ConflictException("Only an account waiting for approval can be rejected.");
		}
		return AdminUserResponse.from(userService.updateStatus(id, UserStatus.REJECTED));
	}

}

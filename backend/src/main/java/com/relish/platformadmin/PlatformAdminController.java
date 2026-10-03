package com.relish.platformadmin;

import com.relish.restaurant.RestaurantService;
import com.relish.restaurant.RestaurantStatus;
import com.relish.user.User;
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

// approval queue for the two roles that don't self-activate - restaurants and delivery partners
// both sit in PENDING until a platform admin looks at them, see UserStatus/RestaurantStatus
@RestController
@RequestMapping("/api/v1/platform-admin")
@PreAuthorize("hasRole('PLATFORM_ADMIN')")
class PlatformAdminController {

	private final RestaurantService restaurantService;
	private final UserService userService;

	PlatformAdminController(RestaurantService restaurantService, UserService userService) {
		this.restaurantService = restaurantService;
		this.userService = userService;
	}

	@GetMapping("/restaurants/pending")
	List<PendingRestaurantResponse> pendingRestaurants() {
		return restaurantService.listByStatus(RestaurantStatus.PENDING).stream()
			.map(PendingRestaurantResponse::from).toList();
	}

	@PostMapping("/restaurants/{id}/approve")
	PendingRestaurantResponse approveRestaurant(@PathVariable UUID id) {
		return PendingRestaurantResponse.from(restaurantService.updateStatus(id, RestaurantStatus.APPROVED));
	}

	@GetMapping("/users/pending")
	List<PendingUserResponse> pendingUsers() {
		return userService.listByStatus(UserStatus.PENDING).stream().map(PendingUserResponse::from).toList();
	}

	@PostMapping("/users/{id}/approve")
	PendingUserResponse approveUser(@PathVariable UUID id) {
		User user = userService.updateStatus(id, UserStatus.ACTIVE);
		return PendingUserResponse.from(user);
	}

}

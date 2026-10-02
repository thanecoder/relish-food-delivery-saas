package com.relish.restaurant;

import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/restaurant-admin/restaurant")
@PreAuthorize("hasRole('RESTAURANT_ADMIN')")
class RestaurantAdminController {

	private final RestaurantService restaurantService;

	RestaurantAdminController(RestaurantService restaurantService) {
		this.restaurantService = restaurantService;
	}

	@GetMapping
	RestaurantResponse mine(@AuthenticationPrincipal Jwt jwt) {
		return RestaurantResponse.from(restaurantService.getByOwner(UUID.fromString(jwt.getSubject())));
	}

}

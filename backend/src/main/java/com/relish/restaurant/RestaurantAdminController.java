package com.relish.restaurant;

import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// always "my own restaurant", resolved from the jwt - theres no restaurantId in this path at all,
// so theres nothing here for one admin to even try pointing at another restaurant's data
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
		return RestaurantResponse.from(myRestaurant(jwt));
	}

	@PutMapping
	RestaurantResponse update(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody RestaurantProfileRequest request) {
		Restaurant restaurant = myRestaurant(jwt);
		return RestaurantResponse.from(restaurantService.updateProfile(restaurant.getId(), request.addressLine(),
			request.city(), request.opensAt(), request.closesAt()));
	}

	private Restaurant myRestaurant(Jwt jwt) {
		return restaurantService.getByOwner(UUID.fromString(jwt.getSubject()));
	}

}

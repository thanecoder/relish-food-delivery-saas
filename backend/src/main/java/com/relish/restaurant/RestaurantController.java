package com.relish.restaurant;

import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// browsing is a customer thing, plus platform admin for the read-only oversight the doc gives them
@RestController
@RequestMapping("/api/v1/restaurants")
@PreAuthorize("hasAnyRole('CUSTOMER', 'PLATFORM_ADMIN')")
class RestaurantController {

	private final RestaurantService restaurantService;

	RestaurantController(RestaurantService restaurantService) {
		this.restaurantService = restaurantService;
	}

	@GetMapping
	List<RestaurantResponse> list() {
		return restaurantService.listApproved().stream().map(RestaurantResponse::from).toList();
	}

	@GetMapping("/{id}")
	RestaurantResponse get(@PathVariable UUID id) {
		return RestaurantResponse.from(restaurantService.getById(id));
	}

}

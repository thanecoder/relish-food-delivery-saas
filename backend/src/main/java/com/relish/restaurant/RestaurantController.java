package com.relish.restaurant;

import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/restaurants")
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

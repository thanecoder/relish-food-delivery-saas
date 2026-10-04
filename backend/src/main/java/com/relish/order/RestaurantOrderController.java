package com.relish.order;

import com.relish.common.NotFoundException;
import com.relish.restaurant.Restaurant;
import com.relish.restaurant.RestaurantService;
import com.relish.user.User;
import com.relish.user.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// the restaurant side of the order flow - OrderController is the customer side
@RestController
@RequestMapping("/api/v1/restaurant-admin/orders")
@PreAuthorize("hasRole('RESTAURANT_ADMIN')")
class RestaurantOrderController {

	private final OrderService orderService;
	private final RestaurantService restaurantService;
	private final UserService userService;

	RestaurantOrderController(OrderService orderService, RestaurantService restaurantService,
			UserService userService) {
		this.orderService = orderService;
		this.restaurantService = restaurantService;
		this.userService = userService;
	}

	@GetMapping
	List<RestaurantOrderResponse> queue(@AuthenticationPrincipal Jwt jwt) {
		Restaurant restaurant = restaurantService.getByOwner(UUID.fromString(jwt.getSubject()));
		return orderService.listForRestaurant(restaurant.getId()).stream()
			.map(o -> RestaurantOrderResponse.from(o, orderService.listItems(o.getId()))).toList();
	}

	@PostMapping("/{id}/status")
	RestaurantOrderResponse updateStatus(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id,
			@Valid @RequestBody OrderStatusRequest request) {
		Restaurant restaurant = restaurantService.getByOwner(UUID.fromString(jwt.getSubject()));
		Order order = orderService.getById(id);
		if (!order.getRestaurant().getId().equals(restaurant.getId())) {
			throw new NotFoundException("No order with id " + id);
		}
		User actor = userService.getById(UUID.fromString(jwt.getSubject()));
		Order updated = orderService.advanceStatus(id, request.status(), actor);
		return RestaurantOrderResponse.from(updated, orderService.listItems(id));
	}

}

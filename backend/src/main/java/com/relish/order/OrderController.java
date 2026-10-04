package com.relish.order;

import com.relish.common.NotFoundException;
import com.relish.restaurant.Restaurant;
import com.relish.restaurant.RestaurantService;
import com.relish.user.Address;
import com.relish.user.AddressService;
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

// placing/viewing this way is a customer concept - the restaurant side of an order lives in
// RestaurantOrderController, not here
@RestController
@RequestMapping("/api/v1/orders")
@PreAuthorize("hasRole('CUSTOMER')")
class OrderController {

	private final OrderService orderService;
	private final UserService userService;
	private final RestaurantService restaurantService;
	private final AddressService addressService;

	OrderController(OrderService orderService, UserService userService, RestaurantService restaurantService,
			AddressService addressService) {
		this.orderService = orderService;
		this.userService = userService;
		this.restaurantService = restaurantService;
		this.addressService = addressService;
	}

	@GetMapping
	List<OrderSummaryResponse> list(@AuthenticationPrincipal Jwt jwt) {
		return orderService.listForCustomer(UUID.fromString(jwt.getSubject())).stream()
			.map(OrderSummaryResponse::from).toList();
	}

	@GetMapping("/{id}")
	OrderResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
		Order order = requireOwnOrder(jwt, id);
		return OrderResponse.from(order, orderService.listItems(id));
	}

	@PostMapping
	OrderResponse place(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody PlaceOrderRequest request) {
		User customer = userService.getById(UUID.fromString(jwt.getSubject()));
		Restaurant restaurant = restaurantService.getById(request.restaurantId());
		Address address = addressService.getById(request.addressId());

		List<OrderService.LineItem> lines = request.items().stream()
			.map(i -> new OrderService.LineItem(i.menuItemId(), i.quantity(), i.notes()))
			.toList();

		Order order = orderService.placeOrder(customer, restaurant, address, lines);
		return OrderResponse.from(order, orderService.listItems(order.getId()));
	}

	private Order requireOwnOrder(Jwt jwt, UUID orderId) {
		Order order = orderService.getById(orderId);
		if (!order.getCustomer().getId().toString().equals(jwt.getSubject())) {
			throw new NotFoundException("No order with id " + orderId);
		}
		return order;
	}

}

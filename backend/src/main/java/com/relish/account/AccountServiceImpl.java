package com.relish.account;

import com.relish.common.ConflictException;
import com.relish.delivery.DeliveryService;
import com.relish.notification.NotificationService;
import com.relish.order.OrderService;
import com.relish.restaurant.RestaurantService;
import com.relish.user.AddressService;
import com.relish.user.UserService;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Lives outside every package it touches on purpose. user/order/delivery/restaurant/notification
 * all point at user (Order.customer, DeliveryAssignment.deliveryPartner, etc), so if this
 * orchestration lived inside UserServiceImpl and called back out to OrderService to clean up a
 * customer's orders, that would draw the arrow the other way too - user depending on order while
 * order still depends on user. ArchUnit's cycle check would fail the build on exactly that.
 * Sitting in its own package, depending inward on all five, keeps the graph a one-way fan-in.
 */
@Service
@Transactional
class AccountServiceImpl implements AccountService {

	private final UserService userService;
	private final AddressService addressService;
	private final OrderService orderService;
	private final DeliveryService deliveryService;
	private final RestaurantService restaurantService;
	private final NotificationService notificationService;

	AccountServiceImpl(UserService userService, AddressService addressService, OrderService orderService,
			DeliveryService deliveryService, RestaurantService restaurantService,
			NotificationService notificationService) {
		this.userService = userService;
		this.addressService = addressService;
		this.orderService = orderService;
		this.deliveryService = deliveryService;
		this.restaurantService = restaurantService;
		this.notificationService = notificationService;
	}

	@Override
	public void deleteAccount(UUID userId) {
		// checked up front, before anything is touched - refusing halfway through would leave
		// addresses and notifications gone but the account itself still standing
		if (restaurantService.existsForOwner(userId)) {
			throw new ConflictException(
				"You still have a restaurant on Relish. Get in touch with support to close it first.");
		}
		if (deliveryService.hasAssignmentsAsPartner(userId)) {
			throw new ConflictException(
				"You have delivery history on Relish as a courier. Get in touch with support to close your account.");
		}

		// children before parents, same reason as the postgres foreign keys themselves -
		// delivery assignments reference orders, order items and status events reference orders
		deliveryService.deleteAllForCustomerOrders(userId);
		orderService.deleteAllForCustomer(userId);
		orderService.clearActorReferences(userId);
		addressService.deleteAllForUser(userId);
		notificationService.deleteAllForUser(userId);
		userService.deleteAccount(userId);
	}

}

package com.relish.order;

import com.relish.restaurant.Restaurant;
import com.relish.user.Address;
import com.relish.user.User;
import java.util.List;
import java.util.UUID;

/** The only way another package may read or write order data — never through the repositories directly. */
public interface OrderService {

	record LineItem(UUID menuItemId, int quantity, String notes) {
	}

	Order getById(UUID id);

	List<Order> listForCustomer(UUID customerId);

	List<Order> listForRestaurant(UUID restaurantId);

	/** Recomputes totals from live menu-item prices — a client-submitted price is never trusted. */
	Order placeOrder(User customer, Restaurant restaurant, Address deliveryAddress, List<LineItem> lines);

	/** Restaurant Admin drives PLACED..READY_FOR_PICKUP (and CANCELLED/REJECTED); rejects invalid transitions. */
	Order advanceStatus(UUID orderId, OrderStatus newStatus, User changedBy);

}

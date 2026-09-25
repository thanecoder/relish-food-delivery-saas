package com.relish.order;

import com.relish.restaurant.Restaurant;
import com.relish.user.Address;
import com.relish.user.User;
import java.util.List;
import java.util.UUID;

public interface OrderService {

	record LineItem(UUID menuItemId, int quantity, String notes) {
	}

	Order getById(UUID id);

	List<OrderItem> listItems(UUID orderId);

	List<Order> listForCustomer(UUID customerId);

	List<Order> listForRestaurant(UUID restaurantId);

	// recalculates totals from current prices, never trust the price sent from the client
	Order placeOrder(User customer, Restaurant restaurant, Address deliveryAddress, List<LineItem> lines);

	Order advanceStatus(UUID orderId, OrderStatus newStatus, User changedBy);

}

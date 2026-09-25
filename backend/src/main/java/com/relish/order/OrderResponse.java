package com.relish.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

record OrderResponse(UUID id, String restaurantName, String status, BigDecimal subtotal, BigDecimal deliveryFee,
		BigDecimal total, Instant placedAt, List<OrderItemResponse> items) {

	static OrderResponse from(Order order, List<OrderItem> items) {
		return new OrderResponse(order.getId(), order.getRestaurant().getName(), order.getStatus().name(),
			order.getSubtotal(), order.getDeliveryFee(), order.getTotal(), order.getCreatedAt(),
			items.stream().map(OrderItemResponse::from).toList());
	}

}

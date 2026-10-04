package com.relish.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

record RestaurantOrderResponse(UUID id, String status, BigDecimal subtotal, BigDecimal total, Instant placedAt,
		List<OrderItemResponse> items) {

	static RestaurantOrderResponse from(Order order, List<OrderItem> items) {
		return new RestaurantOrderResponse(order.getId(), order.getStatus().name(), order.getSubtotal(),
			order.getTotal(), order.getCreatedAt(), items.stream().map(OrderItemResponse::from).toList());
	}

}

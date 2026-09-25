package com.relish.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

record OrderSummaryResponse(UUID id, String restaurantName, String status, BigDecimal total, Instant placedAt) {

	static OrderSummaryResponse from(Order order) {
		return new OrderSummaryResponse(order.getId(), order.getRestaurant().getName(), order.getStatus().name(),
			order.getTotal(), order.getCreatedAt());
	}

}

package com.relish.delivery;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

record DeliveryAssignmentResponse(UUID id, UUID orderId, String status, String restaurantName,
		String deliveryAddressLine, String deliveryCity, String orderStatus, BigDecimal total, Instant pickedUpAt,
		Instant deliveredAt) {

	static DeliveryAssignmentResponse from(DeliveryAssignment a) {
		var order = a.getOrder();
		var address = order.getDeliveryAddress();
		return new DeliveryAssignmentResponse(a.getId(), order.getId(), a.getStatus().name(),
			order.getRestaurant().getName(), address.getLine1(), address.getCity(), order.getStatus().name(),
			order.getTotal(), a.getPickedUpAt(), a.getDeliveredAt());
	}

}

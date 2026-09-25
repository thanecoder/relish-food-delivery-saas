package com.relish.order;

import java.math.BigDecimal;

record OrderItemResponse(String menuItemName, int quantity, BigDecimal unitPrice, String notes) {

	static OrderItemResponse from(OrderItem item) {
		return new OrderItemResponse(item.getMenuItem().getName(), item.getQuantity(), item.getUnitPrice(),
			item.getNotes());
	}

}

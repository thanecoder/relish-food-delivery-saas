package com.relish.menu;

import java.math.BigDecimal;
import java.util.UUID;

record MenuItemResponse(UUID id, String name, String description, BigDecimal price, boolean isVeg,
		boolean isAvailable, String imageUrl) {

	static MenuItemResponse from(MenuItem item) {
		return new MenuItemResponse(item.getId(), item.getName(), item.getDescription(), item.getPrice(),
			item.isVeg(), item.isAvailable(), item.getImageUrl());
	}

}

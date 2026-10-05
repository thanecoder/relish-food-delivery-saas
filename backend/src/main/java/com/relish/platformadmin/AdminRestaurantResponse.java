package com.relish.platformadmin;

import com.relish.restaurant.Restaurant;
import java.util.UUID;

record AdminRestaurantResponse(UUID id, String name, String cuisineTags, String addressLine, String city,
		String status, String imageUrl) {

	static AdminRestaurantResponse from(Restaurant r) {
		return new AdminRestaurantResponse(r.getId(), r.getName(), r.getCuisineTags(), r.getAddressLine(),
			r.getCity(), r.getStatus().name(), r.getImageUrl());
	}

}

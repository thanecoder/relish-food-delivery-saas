package com.relish.restaurant;

import java.util.UUID;

record RestaurantResponse(UUID id, String name, String description, String cuisineTags, String addressLine,
		String city, String status) {

	static RestaurantResponse from(Restaurant r) {
		return new RestaurantResponse(r.getId(), r.getName(), r.getDescription(), r.getCuisineTags(),
			r.getAddressLine(), r.getCity(), r.getStatus().name());
	}

}

package com.relish.platformadmin;

import com.relish.restaurant.Restaurant;
import java.util.UUID;

record PendingRestaurantResponse(UUID id, String name, String cuisineTags, String addressLine, String city) {

	static PendingRestaurantResponse from(Restaurant r) {
		return new PendingRestaurantResponse(r.getId(), r.getName(), r.getCuisineTags(), r.getAddressLine(),
			r.getCity());
	}

}

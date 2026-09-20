package com.relish.restaurant;

import com.relish.user.User;
import java.util.List;
import java.util.UUID;

/** The only way another package may read or write restaurant data — never through {@link RestaurantRepository} directly. */
public interface RestaurantService {

	Restaurant getById(UUID id);

	List<Restaurant> listApproved();

	List<Restaurant> listByStatus(RestaurantStatus status);

	Restaurant apply(User ownerUser, String name, String addressLine, String city);

	Restaurant updateStatus(UUID id, RestaurantStatus status);

}

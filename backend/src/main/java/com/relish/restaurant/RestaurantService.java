package com.relish.restaurant;

import com.relish.user.User;
import java.util.List;
import java.util.UUID;

public interface RestaurantService {

	Restaurant getById(UUID id);

	Restaurant getByOwner(UUID ownerUserId);

	List<Restaurant> listApproved();

	List<Restaurant> listByStatus(RestaurantStatus status);

	Restaurant apply(User ownerUser, String name, String addressLine, String city);

	Restaurant updateStatus(UUID id, RestaurantStatus status);

	boolean existsForOwner(UUID ownerUserId);

}

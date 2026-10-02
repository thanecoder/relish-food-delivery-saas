package com.relish.menu;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface MenuCategoryRepository extends JpaRepository<MenuCategory, UUID> {

	List<MenuCategory> findByRestaurantIdOrderBySortOrder(UUID restaurantId);

	// a plain exists query, not a walk across category.restaurant - that association is lazy and
	// theres no open session by the time the controller would be comparing owner ids
	boolean existsByIdAndRestaurantId(UUID id, UUID restaurantId);

}

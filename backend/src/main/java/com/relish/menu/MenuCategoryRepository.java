package com.relish.menu;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface MenuCategoryRepository extends JpaRepository<MenuCategory, UUID> {

	List<MenuCategory> findByRestaurantIdOrderBySortOrder(UUID restaurantId);

}

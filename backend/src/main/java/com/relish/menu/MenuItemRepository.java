package com.relish.menu;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {

	List<MenuItem> findByCategoryId(UUID categoryId);

	// same reasoning as MenuCategoryRepository.existsByIdAndRestaurantId - one query, no lazy walk
	boolean existsByIdAndCategory_RestaurantId(UUID id, UUID restaurantId);

}

package com.relish.menu;

import com.relish.restaurant.Restaurant;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface MenuService {

	List<MenuCategory> listCategories(UUID restaurantId);

	List<MenuItem> listItems(UUID categoryId);

	MenuCategory getCategoryById(UUID categoryId);

	MenuItem getItemById(UUID itemId);

	MenuCategory addCategory(Restaurant restaurant, String name, int sortOrder);

	MenuCategory updateCategory(UUID categoryId, String name, int sortOrder);

	MenuItem addItem(MenuCategory category, String name, String description, BigDecimal price, boolean isVeg);

	MenuItem updateItem(UUID itemId, String name, String description, BigDecimal price, boolean isVeg);

	MenuItem setAvailability(UUID itemId, boolean available);

	// ownership checks for the restaurant-admin endpoints - a plain query, not a walk across
	// lazy associations the caller has no open session to resolve
	boolean isCategoryInRestaurant(UUID categoryId, UUID restaurantId);

	boolean isItemInRestaurant(UUID itemId, UUID restaurantId);

}

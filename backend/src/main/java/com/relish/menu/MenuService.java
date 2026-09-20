package com.relish.menu;

import com.relish.restaurant.Restaurant;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface MenuService {

	List<MenuCategory> listCategories(UUID restaurantId);

	List<MenuItem> listItems(UUID categoryId);

	MenuItem getItemById(UUID itemId);

	MenuCategory addCategory(Restaurant restaurant, String name, int sortOrder);

	MenuItem addItem(MenuCategory category, String name, BigDecimal price, boolean isVeg);

	MenuItem setAvailability(UUID itemId, boolean available);

}

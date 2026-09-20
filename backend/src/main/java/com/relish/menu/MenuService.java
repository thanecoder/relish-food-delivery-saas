package com.relish.menu;

import com.relish.restaurant.Restaurant;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** The only way another package may read or write menu data — never through the repositories directly. */
public interface MenuService {

	List<MenuCategory> listCategories(UUID restaurantId);

	List<MenuItem> listItems(UUID categoryId);

	/** Used by the order package to recompute order totals from live prices — never trust a client-submitted price. */
	MenuItem getItemById(UUID itemId);

	MenuCategory addCategory(Restaurant restaurant, String name, int sortOrder);

	MenuItem addItem(MenuCategory category, String name, BigDecimal price, boolean isVeg);

	MenuItem setAvailability(UUID itemId, boolean available);

}

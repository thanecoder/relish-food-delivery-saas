package com.relish.menu;

import com.relish.common.NotFoundException;
import com.relish.restaurant.Restaurant;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
class MenuServiceImpl implements MenuService {

	private final MenuCategoryRepository categoryRepository;
	private final MenuItemRepository itemRepository;

	MenuServiceImpl(MenuCategoryRepository categoryRepository, MenuItemRepository itemRepository) {
		this.categoryRepository = categoryRepository;
		this.itemRepository = itemRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<MenuCategory> listCategories(UUID restaurantId) {
		return categoryRepository.findByRestaurantIdOrderBySortOrder(restaurantId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<MenuItem> listItems(UUID categoryId) {
		return itemRepository.findByCategoryId(categoryId);
	}

	@Override
	@Transactional(readOnly = true)
	public MenuCategory getCategoryById(UUID categoryId) {
		return categoryRepository.findById(categoryId)
			.orElseThrow(() -> new NotFoundException("No menu category with id " + categoryId));
	}

	@Override
	@Transactional(readOnly = true)
	public MenuItem getItemById(UUID itemId) {
		return itemRepository.findById(itemId)
			.orElseThrow(() -> new NotFoundException("No menu item with id " + itemId));
	}

	@Override
	public MenuCategory addCategory(Restaurant restaurant, String name, int sortOrder) {
		return categoryRepository.save(new MenuCategory(restaurant, name, sortOrder));
	}

	@Override
	public MenuCategory updateCategory(UUID categoryId, String name, int sortOrder) {
		MenuCategory category = getCategoryById(categoryId);
		category.setName(name);
		category.setSortOrder(sortOrder);
		return category;
	}

	@Override
	public MenuItem addItem(MenuCategory category, String name, String description, BigDecimal price, boolean isVeg) {
		return itemRepository.save(new MenuItem(category, name, description, price, isVeg));
	}

	@Override
	public MenuItem updateItem(UUID itemId, String name, String description, BigDecimal price, boolean isVeg) {
		MenuItem item = getItemById(itemId);
		item.setName(name);
		item.setDescription(description);
		item.setPrice(price);
		item.setVeg(isVeg);
		return item;
	}

	@Override
	public MenuItem setAvailability(UUID itemId, boolean available) {
		MenuItem item = getItemById(itemId);
		item.setAvailable(available);
		return item;
	}

	@Override
	@Transactional(readOnly = true)
	public boolean isCategoryInRestaurant(UUID categoryId, UUID restaurantId) {
		return categoryRepository.existsByIdAndRestaurantId(categoryId, restaurantId);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean isItemInRestaurant(UUID itemId, UUID restaurantId) {
		return itemRepository.existsByIdAndCategory_RestaurantId(itemId, restaurantId);
	}

}

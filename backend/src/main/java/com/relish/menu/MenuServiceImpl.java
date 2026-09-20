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
	public MenuItem getItemById(UUID itemId) {
		return itemRepository.findById(itemId)
			.orElseThrow(() -> new NotFoundException("No menu item with id " + itemId));
	}

	@Override
	public MenuCategory addCategory(Restaurant restaurant, String name, int sortOrder) {
		return categoryRepository.save(new MenuCategory(restaurant, name, sortOrder));
	}

	@Override
	public MenuItem addItem(MenuCategory category, String name, BigDecimal price, boolean isVeg) {
		return itemRepository.save(new MenuItem(category, name, price, isVeg));
	}

	@Override
	public MenuItem setAvailability(UUID itemId, boolean available) {
		MenuItem item = getItemById(itemId);
		item.setAvailable(available);
		return item;
	}

}

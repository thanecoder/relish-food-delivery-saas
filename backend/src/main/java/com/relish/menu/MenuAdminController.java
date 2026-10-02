package com.relish.menu;

import com.relish.common.NotFoundException;
import com.relish.restaurant.Restaurant;
import com.relish.restaurant.RestaurantService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// menu management for the restaurant admin's own restaurant - always resolved from the jwt,
// never a restaurantId in the url, so theres nothing for one admin to point at another's data
@RestController
@RequestMapping("/api/v1/restaurant-admin/menu")
@PreAuthorize("hasRole('RESTAURANT_ADMIN')")
class MenuAdminController {

	private final MenuService menuService;
	private final RestaurantService restaurantService;

	MenuAdminController(MenuService menuService, RestaurantService restaurantService) {
		this.menuService = menuService;
		this.restaurantService = restaurantService;
	}

	@GetMapping
	List<MenuCategoryResponse> getMenu(@AuthenticationPrincipal Jwt jwt) {
		Restaurant restaurant = myRestaurant(jwt);
		return menuService.listCategories(restaurant.getId()).stream()
			.map(category -> new MenuCategoryResponse(category.getId(), category.getName(),
				menuService.listItems(category.getId()).stream().map(MenuItemResponse::from).toList()))
			.toList();
	}

	@PostMapping("/categories")
	MenuCategoryResponse addCategory(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CategoryRequest request) {
		Restaurant restaurant = myRestaurant(jwt);
		MenuCategory category = menuService.addCategory(restaurant, request.name(), request.sortOrder());
		return new MenuCategoryResponse(category.getId(), category.getName(), List.of());
	}

	@PutMapping("/categories/{id}")
	MenuCategoryResponse updateCategory(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id,
			@Valid @RequestBody CategoryRequest request) {
		requireOwnCategory(jwt, id);
		MenuCategory category = menuService.updateCategory(id, request.name(), request.sortOrder());
		return new MenuCategoryResponse(category.getId(), category.getName(),
			menuService.listItems(category.getId()).stream().map(MenuItemResponse::from).toList());
	}

	@PostMapping("/items")
	MenuItemResponse addItem(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody MenuItemCreateRequest request) {
		requireOwnCategory(jwt, request.categoryId());
		MenuCategory category = menuService.getCategoryById(request.categoryId());
		MenuItem item = menuService.addItem(category, request.name(), request.description(), request.price(),
			request.isVeg());
		return MenuItemResponse.from(item);
	}

	@PutMapping("/items/{id}")
	MenuItemResponse updateItem(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id,
			@Valid @RequestBody MenuItemUpdateRequest request) {
		requireOwnItem(jwt, id);
		MenuItem item = menuService.updateItem(id, request.name(), request.description(), request.price(),
			request.isVeg());
		return MenuItemResponse.from(item);
	}

	@PatchMapping("/items/{id}/availability")
	MenuItemResponse setAvailability(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id,
			@RequestBody AvailabilityRequest request) {
		requireOwnItem(jwt, id);
		return MenuItemResponse.from(menuService.setAvailability(id, request.available()));
	}

	private Restaurant myRestaurant(Jwt jwt) {
		return restaurantService.getByOwner(UUID.fromString(jwt.getSubject()));
	}

	private void requireOwnCategory(Jwt jwt, UUID categoryId) {
		Restaurant restaurant = myRestaurant(jwt);
		if (!menuService.isCategoryInRestaurant(categoryId, restaurant.getId())) {
			// 404 not 403 - same reasoning as OrderController.requireOwnOrder, dont confirm the id even exists
			throw new NotFoundException("No menu category with id " + categoryId);
		}
	}

	private void requireOwnItem(Jwt jwt, UUID itemId) {
		Restaurant restaurant = myRestaurant(jwt);
		if (!menuService.isItemInRestaurant(itemId, restaurant.getId())) {
			throw new NotFoundException("No menu item with id " + itemId);
		}
	}

}

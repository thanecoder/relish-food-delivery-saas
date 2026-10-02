package com.relish.menu;

import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/restaurants/{restaurantId}/menu")
@PreAuthorize("hasAnyRole('CUSTOMER', 'PLATFORM_ADMIN')")
class MenuController {

	private final MenuService menuService;

	MenuController(MenuService menuService) {
		this.menuService = menuService;
	}

	@GetMapping
	List<MenuCategoryResponse> getMenu(@PathVariable UUID restaurantId) {
		return menuService.listCategories(restaurantId).stream()
			.map(category -> new MenuCategoryResponse(category.getId(), category.getName(),
				menuService.listItems(category.getId()).stream().map(MenuItemResponse::from).toList()))
			.toList();
	}

}

package com.relish.menu;

import java.util.List;
import java.util.UUID;

record MenuCategoryResponse(UUID id, String name, List<MenuItemResponse> items) {
}

package com.relish.menu;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

// no categoryId here - moving an item between categories isnt something this pass needs
record MenuItemUpdateRequest(@NotBlank String name, String description, @NotNull @DecimalMin("0.0") BigDecimal price,
		boolean isVeg) {
}

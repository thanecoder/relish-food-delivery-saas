package com.relish.menu;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

record MenuItemCreateRequest(@NotNull UUID categoryId, @NotBlank String name, String description,
		@NotNull @DecimalMin("0.0") BigDecimal price, boolean isVeg) {
}

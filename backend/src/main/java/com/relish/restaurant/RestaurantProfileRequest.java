package com.relish.restaurant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

// no name/description/cuisineTags here on purpose - this pass is address + hours, changing the
// restaurant's identity is a bigger decision than editing where it is and when its open
record RestaurantProfileRequest(@NotBlank String addressLine, @NotBlank String city, @NotNull LocalTime opensAt,
		@NotNull LocalTime closesAt) {
}

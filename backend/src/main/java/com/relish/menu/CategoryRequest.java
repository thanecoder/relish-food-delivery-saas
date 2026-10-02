package com.relish.menu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

// same shape for creating and renaming/reordering a category, no reason for two records
record CategoryRequest(@NotBlank String name, @PositiveOrZero int sortOrder) {
}

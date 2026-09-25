package com.relish.user;

import jakarta.validation.constraints.NotBlank;

record AddressRequest(@NotBlank String label, @NotBlank String line1, String line2, @NotBlank String city,
		boolean isDefault) {
}

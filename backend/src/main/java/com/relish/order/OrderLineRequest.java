package com.relish.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

record OrderLineRequest(@NotNull UUID menuItemId, @Min(1) int quantity, String notes) {
}

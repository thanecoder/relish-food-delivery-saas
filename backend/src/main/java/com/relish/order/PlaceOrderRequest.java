package com.relish.order;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

record PlaceOrderRequest(@NotNull UUID restaurantId, @NotNull UUID addressId, @NotEmpty List<OrderLineRequest> items) {
}

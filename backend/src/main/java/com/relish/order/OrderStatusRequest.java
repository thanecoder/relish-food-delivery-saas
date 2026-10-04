package com.relish.order;

import jakarta.validation.constraints.NotNull;

record OrderStatusRequest(@NotNull OrderStatus status) {
}

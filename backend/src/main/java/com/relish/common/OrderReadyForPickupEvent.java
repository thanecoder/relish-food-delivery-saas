package com.relish.common;

import java.util.UUID;

// delivery listens for this and auto assigns a partner, so order doesnt need to call delivery directly
public record OrderReadyForPickupEvent(UUID orderId, UUID restaurantId) {
}

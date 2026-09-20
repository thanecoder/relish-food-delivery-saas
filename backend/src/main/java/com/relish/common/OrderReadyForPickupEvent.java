package com.relish.common;

import java.util.UUID;

/**
 * Published by {@code order} when a restaurant marks an order READY_FOR_PICKUP.
 * {@code delivery} listens for this to auto-assign a partner, instead of order calling
 * delivery's service directly — keeps the two packages from depending on each other.
 */
public record OrderReadyForPickupEvent(UUID orderId, UUID restaurantId) {
}

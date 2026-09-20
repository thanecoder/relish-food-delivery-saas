package com.relish.common;

import java.util.UUID;

/**
 * Published by {@code delivery} on pickup/delivered. {@code order} listens for this to advance
 * the order's status, instead of delivery calling order's service directly — keeps the two
 * packages from depending on each other.
 */
public record DeliveryStatusChangedEvent(UUID orderId, Phase phase) {

	public enum Phase {
		PICKED_UP,
		DELIVERED
	}

}

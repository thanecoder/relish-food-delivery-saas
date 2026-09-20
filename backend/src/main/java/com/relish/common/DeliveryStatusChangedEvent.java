package com.relish.common;

import java.util.UUID;

// delivery fires this instead of calling order directly, avoids the two modules depending on eachother
public record DeliveryStatusChangedEvent(UUID orderId, Phase phase) {

	public enum Phase {
		PICKED_UP,
		DELIVERED
	}

}

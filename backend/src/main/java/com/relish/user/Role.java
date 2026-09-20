package com.relish.user;

/** One flat role per user — no composition, no per-tenant scoping. */
public enum Role {
	CUSTOMER,
	RESTAURANT_ADMIN,
	DELIVERY_PARTNER,
	PLATFORM_ADMIN
}

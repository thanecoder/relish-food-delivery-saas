package com.relish.user;

import java.util.UUID;

record AddressResponse(UUID id, String label, String line1, String line2, String city, boolean isDefault) {

	static AddressResponse from(Address a) {
		return new AddressResponse(a.getId(), a.getLabel(), a.getLine1(), a.getLine2(), a.getCity(), a.isDefault());
	}

}

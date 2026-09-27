package com.relish.user;

import java.util.List;
import java.util.UUID;

public interface AddressService {

	List<Address> listForUser(UUID userId);

	Address add(User user, String label, String line1, String line2, String city, boolean isDefault);

	Address getById(UUID id);

	void deleteAllForUser(UUID userId);

}

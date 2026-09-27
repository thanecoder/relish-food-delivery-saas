package com.relish.user;

import com.relish.common.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
class AddressServiceImpl implements AddressService {

	private final AddressRepository addressRepository;

	AddressServiceImpl(AddressRepository addressRepository) {
		this.addressRepository = addressRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Address> listForUser(UUID userId) {
		return addressRepository.findByUserId(userId);
	}

	@Override
	public Address add(User user, String label, String line1, String line2, String city, boolean isDefault) {
		Address address = new Address(user, label, line1, city);
		address.setLine2(line2);
		address.setDefault(isDefault);
		return addressRepository.save(address);
	}

	@Override
	@Transactional(readOnly = true)
	public Address getById(UUID id) {
		return addressRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("No address with id " + id));
	}

	@Override
	public void deleteAllForUser(UUID userId) {
		addressRepository.deleteByUserId(userId);
	}

}

package com.relish.restaurant;

import com.relish.common.NotFoundException;
import com.relish.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
class RestaurantServiceImpl implements RestaurantService {

	private final RestaurantRepository restaurantRepository;

	RestaurantServiceImpl(RestaurantRepository restaurantRepository) {
		this.restaurantRepository = restaurantRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public Restaurant getById(UUID id) {
		return restaurantRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("No restaurant with id " + id));
	}

	@Override
	@Transactional(readOnly = true)
	public List<Restaurant> listApproved() {
		return restaurantRepository.findByStatus(RestaurantStatus.APPROVED);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Restaurant> listByStatus(RestaurantStatus status) {
		return restaurantRepository.findByStatus(status);
	}

	@Override
	public Restaurant apply(User ownerUser, String name, String addressLine, String city) {
		return restaurantRepository.save(new Restaurant(ownerUser, name, addressLine, city));
	}

	@Override
	public Restaurant updateStatus(UUID id, RestaurantStatus status) {
		Restaurant restaurant = getById(id);
		restaurant.setStatus(status);
		return restaurant;
	}

	@Override
	@Transactional(readOnly = true)
	public boolean existsForOwner(UUID ownerUserId) {
		return restaurantRepository.findByOwnerUserId(ownerUserId).isPresent();
	}

}

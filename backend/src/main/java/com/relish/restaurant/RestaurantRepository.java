package com.relish.restaurant;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface RestaurantRepository extends JpaRepository<Restaurant, UUID> {

	Optional<Restaurant> findByOwnerUserId(UUID ownerUserId);

	List<Restaurant> findByStatus(RestaurantStatus status);

	List<Restaurant> findAllByOrderByNameAsc();

}

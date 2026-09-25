package com.relish.order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface OrderRepository extends JpaRepository<Order, UUID> {

	// restaurant is fetched eagerly here - it's a single row, no cartesian-product cost,
	// and every read path (list, detail) needs its name anyway. avoids LazyInitializationException
	// once the response DTO gets built outside the transaction.
	@Query("select o from Order o join fetch o.restaurant where o.id = :id")
	Optional<Order> findByIdFetchRestaurant(UUID id);

	@Query("select o from Order o join fetch o.restaurant where o.customer.id = :customerId order by o.createdAt desc")
	List<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

	@Query("select o from Order o join fetch o.restaurant where o.restaurant.id = :restaurantId order by o.createdAt desc")
	List<Order> findByRestaurantIdOrderByCreatedAtDesc(UUID restaurantId);

}

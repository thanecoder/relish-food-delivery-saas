package com.relish.order;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface OrderRepository extends JpaRepository<Order, UUID> {

	List<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

	List<Order> findByRestaurantIdOrderByCreatedAtDesc(UUID restaurantId);

}

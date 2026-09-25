package com.relish.order;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

	// menuItem fetched eagerly - same reasoning as OrderRepository, avoids a lazy-load
	// blowing up once OrderItemResponse gets built outside the transaction.
	@Query("select oi from OrderItem oi join fetch oi.menuItem where oi.order.id = :orderId")
	List<OrderItem> findByOrderId(UUID orderId);

}

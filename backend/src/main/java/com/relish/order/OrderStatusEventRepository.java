package com.relish.order;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface OrderStatusEventRepository extends JpaRepository<OrderStatusEvent, UUID> {

	List<OrderStatusEvent> findByOrderIdOrderByCreatedAt(UUID orderId);

}

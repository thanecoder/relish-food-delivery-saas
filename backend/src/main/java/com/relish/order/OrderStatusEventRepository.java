package com.relish.order;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface OrderStatusEventRepository extends JpaRepository<OrderStatusEvent, UUID> {

	List<OrderStatusEvent> findByOrderIdOrderByCreatedAt(UUID orderId);

	@Modifying(clearAutomatically = true)
	@Query("delete from OrderStatusEvent e where e.order.id in (select o.id from Order o where o.customer.id = :customerId)")
	void deleteAllForCustomerOrders(UUID customerId);

	// for events this user left on someone ELSE's order (acting as restaurant/admin) - the column
	// is nullable so we keep the audit row, just drop the reference to the account thats going away
	@Modifying(clearAutomatically = true)
	@Query("update OrderStatusEvent e set e.changedByUser = null where e.changedByUser.id = :userId")
	void clearChangedByUser(UUID userId);

}

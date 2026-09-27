package com.relish.delivery;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, UUID> {

	Optional<DeliveryAssignment> findByOrderId(UUID orderId);

	List<DeliveryAssignment> findByDeliveryPartnerIdOrderByCreatedAtDesc(UUID deliveryPartnerId);

	long countByDeliveryPartnerIdAndStatusNot(UUID deliveryPartnerId, DeliveryAssignmentStatus status);

	boolean existsByDeliveryPartnerId(UUID deliveryPartnerId);

	// has to run before OrderService deletes the orders themselves - the FK on order_id wont allow it otherwise
	@Modifying(clearAutomatically = true)
	@Query("delete from DeliveryAssignment a where a.order.id in (select o.id from Order o where o.customer.id = :customerId)")
	void deleteAllForCustomerOrders(UUID customerId);

}

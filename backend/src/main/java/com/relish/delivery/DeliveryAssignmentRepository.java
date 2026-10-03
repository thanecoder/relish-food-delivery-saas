package com.relish.delivery;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, UUID> {

	Optional<DeliveryAssignment> findByOrderId(UUID orderId);

	// order/restaurant/address fetched eagerly - same reasoning as OrderRepository, the response
	// DTO gets built after this transaction closes and open-in-view is off
	@Query("select a from DeliveryAssignment a join fetch a.order o join fetch o.restaurant join fetch o.deliveryAddress where a.id = :id")
	Optional<DeliveryAssignment> findByIdFetchOrder(UUID id);

	@Query("select a from DeliveryAssignment a join fetch a.order o join fetch o.restaurant join fetch o.deliveryAddress where a.deliveryPartner.id = :deliveryPartnerId order by a.createdAt desc")
	List<DeliveryAssignment> findByDeliveryPartnerIdOrderByCreatedAtDesc(UUID deliveryPartnerId);

	long countByDeliveryPartnerIdAndStatusNot(UUID deliveryPartnerId, DeliveryAssignmentStatus status);

	boolean existsByDeliveryPartnerId(UUID deliveryPartnerId);

	// has to run before OrderService deletes the orders themselves - the FK on order_id wont allow it otherwise
	@Modifying(clearAutomatically = true)
	@Query("delete from DeliveryAssignment a where a.order.id in (select o.id from Order o where o.customer.id = :customerId)")
	void deleteAllForCustomerOrders(UUID customerId);

}

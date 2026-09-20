package com.relish.delivery;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, UUID> {

	Optional<DeliveryAssignment> findByOrderId(UUID orderId);

	List<DeliveryAssignment> findByDeliveryPartnerIdOrderByCreatedAtDesc(UUID deliveryPartnerId);

	long countByDeliveryPartnerIdAndStatusNot(UUID deliveryPartnerId, DeliveryAssignmentStatus status);

}

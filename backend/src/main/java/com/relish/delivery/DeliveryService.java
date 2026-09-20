package com.relish.delivery;

import com.relish.user.User;
import java.util.List;
import java.util.UUID;

/** The only way another package may read or write delivery data — never through {@link DeliveryAssignmentRepository} directly. */
public interface DeliveryService {

	DeliveryAssignment getById(UUID id);

	List<DeliveryAssignment> listForPartner(UUID deliveryPartnerId);

	DeliveryAssignment markPickedUp(UUID assignmentId, User actingPartner);

	DeliveryAssignment markDelivered(UUID assignmentId, User actingPartner);

}

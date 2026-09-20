package com.relish.delivery;

import com.relish.user.User;
import java.util.List;
import java.util.UUID;

public interface DeliveryService {

	DeliveryAssignment getById(UUID id);

	List<DeliveryAssignment> listForPartner(UUID deliveryPartnerId);

	DeliveryAssignment markPickedUp(UUID assignmentId, User actingPartner);

	DeliveryAssignment markDelivered(UUID assignmentId, User actingPartner);

}

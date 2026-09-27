package com.relish.delivery;

import com.relish.user.User;
import java.util.List;
import java.util.UUID;

public interface DeliveryService {

	DeliveryAssignment getById(UUID id);

	List<DeliveryAssignment> listForPartner(UUID deliveryPartnerId);

	DeliveryAssignment markPickedUp(UUID assignmentId, User actingPartner);

	DeliveryAssignment markDelivered(UUID assignmentId, User actingPartner);

	// true means this user has delivery history as a courier - account deletion refuses to
	// touch that, its not really "their" data to delete, its shared with whoever they delivered for
	boolean hasAssignmentsAsPartner(UUID userId);

	void deleteAllForCustomerOrders(UUID customerId);

}

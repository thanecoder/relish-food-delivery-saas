package com.relish.delivery;

import com.relish.common.DeliveryStatusChangedEvent;
import com.relish.common.NotFoundException;
import com.relish.common.OrderReadyForPickupEvent;
import com.relish.order.Order;
import com.relish.order.OrderService;
import com.relish.user.Role;
import com.relish.user.User;
import com.relish.user.UserService;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@Transactional
class DeliveryServiceImpl implements DeliveryService {

	private static final Logger log = LoggerFactory.getLogger(DeliveryServiceImpl.class);

	private final DeliveryAssignmentRepository assignmentRepository;
	private final UserService userService;
	private final OrderService orderService;
	private final ApplicationEventPublisher events;

	DeliveryServiceImpl(DeliveryAssignmentRepository assignmentRepository, UserService userService,
			OrderService orderService, ApplicationEventPublisher events) {
		this.assignmentRepository = assignmentRepository;
		this.userService = userService;
		this.orderService = orderService;
		this.events = events;
	}

	@Override
	@Transactional(readOnly = true)
	public DeliveryAssignment getById(UUID id) {
		return assignmentRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("No delivery assignment with id " + id));
	}

	@Override
	@Transactional(readOnly = true)
	public List<DeliveryAssignment> listForPartner(UUID deliveryPartnerId) {
		return assignmentRepository.findByDeliveryPartnerIdOrderByCreatedAtDesc(deliveryPartnerId);
	}

	@Override
	public DeliveryAssignment markPickedUp(UUID assignmentId, User actingPartner) {
		DeliveryAssignment assignment = requireOwnedByPartner(assignmentId, actingPartner);
		assignment.markPickedUp();
		events.publishEvent(new DeliveryStatusChangedEvent(assignment.getOrder().getId(),
			DeliveryStatusChangedEvent.Phase.PICKED_UP));
		return assignment;
	}

	@Override
	public DeliveryAssignment markDelivered(UUID assignmentId, User actingPartner) {
		DeliveryAssignment assignment = requireOwnedByPartner(assignmentId, actingPartner);
		assignment.markDelivered();
		events.publishEvent(new DeliveryStatusChangedEvent(assignment.getOrder().getId(),
			DeliveryStatusChangedEvent.Phase.DELIVERED));
		return assignment;
	}

	private DeliveryAssignment requireOwnedByPartner(UUID assignmentId, User actingPartner) {
		DeliveryAssignment assignment = getById(assignmentId);
		if (!assignment.getDeliveryPartner().getId().equals(actingPartner.getId())) {
			throw new AccessDeniedException("This delivery isn't assigned to you.");
		}
		return assignment;
	}

	/**
	 * Auto-assigns the least-busy active Delivery Partner when a restaurant marks an order
	 * READY_FOR_PICKUP. There is no manual dispatcher UI (see the architecture doc's role model).
	 */
	@TransactionalEventListener
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void onOrderReadyForPickup(OrderReadyForPickupEvent event) {
		List<User> partners = userService.listActiveByRole(Role.DELIVERY_PARTNER);
		User leastBusy = partners.stream()
			.min(Comparator.comparingLong(p -> assignmentRepository
				.countByDeliveryPartnerIdAndStatusNot(p.getId(), DeliveryAssignmentStatus.DELIVERED)))
			.orElse(null);

		if (leastBusy == null) {
			log.warn("Order {} is READY_FOR_PICKUP but no active delivery partner is available to assign.",
				event.orderId());
			return;
		}

		Order order = orderService.getById(event.orderId());
		assignmentRepository.save(new DeliveryAssignment(order, leastBusy));
	}

}

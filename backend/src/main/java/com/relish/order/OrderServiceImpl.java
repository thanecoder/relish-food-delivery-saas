package com.relish.order;

import com.relish.common.ConflictException;
import com.relish.common.DeliveryStatusChangedEvent;
import com.relish.common.NotFoundException;
import com.relish.common.OrderReadyForPickupEvent;
import com.relish.menu.MenuItem;
import com.relish.menu.MenuService;
import com.relish.restaurant.Restaurant;
import com.relish.user.Address;
import com.relish.user.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@Transactional
class OrderServiceImpl implements OrderService {

	// flat fee for now, keeps things simple
	private static final BigDecimal DELIVERY_FEE = new BigDecimal("2.99");

	// OUT_FOR_DELIVERY/DELIVERED arent here on purpose, those only happen thru the delivery events below
	private static final Map<OrderStatus, Set<OrderStatus>> ADMIN_TRANSITIONS = Map.of(
		OrderStatus.PLACED, Set.of(OrderStatus.ACCEPTED, OrderStatus.REJECTED),
		OrderStatus.ACCEPTED, Set.of(OrderStatus.PREPARING, OrderStatus.CANCELLED),
		OrderStatus.PREPARING, Set.of(OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED));

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final OrderStatusEventRepository statusEventRepository;
	private final MenuService menuService;
	private final ApplicationEventPublisher events;

	OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
			OrderStatusEventRepository statusEventRepository, MenuService menuService,
			ApplicationEventPublisher events) {
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.statusEventRepository = statusEventRepository;
		this.menuService = menuService;
		this.events = events;
	}

	@Override
	@Transactional(readOnly = true)
	public Order getById(UUID id) {
		return orderRepository.findByIdFetchRestaurant(id)
			.orElseThrow(() -> new NotFoundException("No order with id " + id));
	}

	@Override
	@Transactional(readOnly = true)
	public List<OrderItem> listItems(UUID orderId) {
		return orderItemRepository.findByOrderId(orderId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Order> listForCustomer(UUID customerId) {
		return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Order> listForRestaurant(UUID restaurantId) {
		return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
	}

	@Override
	public Order placeOrder(User customer, Restaurant restaurant, Address deliveryAddress, List<LineItem> lines) {
		if (lines.isEmpty()) {
			throw new ConflictException("An order needs at least one item.");
		}
		BigDecimal subtotal = BigDecimal.ZERO;
		for (LineItem line : lines) {
			MenuItem item = menuService.getItemById(line.menuItemId());
			subtotal = subtotal.add(item.getPrice().multiply(BigDecimal.valueOf(line.quantity())));
		}

		Order order = orderRepository.save(new Order(customer, restaurant, deliveryAddress, subtotal, DELIVERY_FEE));
		for (LineItem line : lines) {
			MenuItem item = menuService.getItemById(line.menuItemId());
			var orderItem = new OrderItem(order, item, line.quantity(), item.getPrice());
			orderItem.setNotes(line.notes());
			orderItemRepository.save(orderItem);
		}
		statusEventRepository.save(new OrderStatusEvent(order, OrderStatus.PLACED, customer));
		return order;
	}

	@Override
	public Order advanceStatus(UUID orderId, OrderStatus newStatus, User changedBy) {
		Order order = getById(orderId);
		Set<OrderStatus> allowed = ADMIN_TRANSITIONS.getOrDefault(order.getStatus(), Set.of());
		if (!allowed.contains(newStatus)) {
			throw new ConflictException(
				"Cannot move an order from " + order.getStatus() + " to " + newStatus + ".");
		}
		applyStatus(order, newStatus, changedBy);
		if (newStatus == OrderStatus.READY_FOR_PICKUP) {
			events.publishEvent(new OrderReadyForPickupEvent(order.getId(), order.getRestaurant().getId()));
		}
		return order;
	}

	@TransactionalEventListener
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void onDeliveryStatusChanged(DeliveryStatusChangedEvent event) {
		Order order = getById(event.orderId());
		OrderStatus newStatus = switch (event.phase()) {
			case PICKED_UP -> OrderStatus.OUT_FOR_DELIVERY;
			case DELIVERED -> OrderStatus.DELIVERED;
		};
		applyStatus(order, newStatus, null);
	}

	private void applyStatus(Order order, OrderStatus newStatus, User changedBy) {
		order.setStatus(newStatus);
		statusEventRepository.save(new OrderStatusEvent(order, newStatus, changedBy));
	}

}

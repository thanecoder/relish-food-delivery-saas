package com.relish.delivery;

import com.relish.common.BaseEntity;
import com.relish.order.Order;
import com.relish.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "delivery_assignments")
public class DeliveryAssignment extends BaseEntity {

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "order_id", nullable = false, unique = true)
	private Order order;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "delivery_partner_id", nullable = false)
	private User deliveryPartner;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 16)
	private DeliveryAssignmentStatus status;

	private Instant pickedUpAt;

	private Instant deliveredAt;

	protected DeliveryAssignment() {
	}

	public DeliveryAssignment(Order order, User deliveryPartner) {
		this.order = order;
		this.deliveryPartner = deliveryPartner;
		this.status = DeliveryAssignmentStatus.ASSIGNED;
	}

	public Order getOrder() {
		return order;
	}

	public User getDeliveryPartner() {
		return deliveryPartner;
	}

	public DeliveryAssignmentStatus getStatus() {
		return status;
	}

	void markPickedUp() {
		this.status = DeliveryAssignmentStatus.PICKED_UP;
		this.pickedUpAt = Instant.now();
	}

	void markDelivered() {
		this.status = DeliveryAssignmentStatus.DELIVERED;
		this.deliveredAt = Instant.now();
	}

	public Instant getPickedUpAt() {
		return pickedUpAt;
	}

	public Instant getDeliveredAt() {
		return deliveredAt;
	}

}

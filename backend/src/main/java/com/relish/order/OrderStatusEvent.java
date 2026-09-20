package com.relish.order;

import com.relish.common.BaseEntity;
import com.relish.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** Pure audit trail — the current state always lives on {@link Order#getStatus()}, never replayed from here. */
@Entity
@Table(name = "order_status_events")
public class OrderStatusEvent extends BaseEntity {

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "order_id", nullable = false)
	private Order order;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 32)
	private OrderStatus status;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "changed_by_user_id")
	private User changedByUser;

	protected OrderStatusEvent() {
	}

	public OrderStatusEvent(Order order, OrderStatus status, User changedByUser) {
		this.order = order;
		this.status = status;
		this.changedByUser = changedByUser;
	}

	public Order getOrder() {
		return order;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public User getChangedByUser() {
		return changedByUser;
	}

}

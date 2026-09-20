package com.relish.order;

import com.relish.common.BaseEntity;
import com.relish.restaurant.Restaurant;
import com.relish.user.Address;
import com.relish.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "customer_id", nullable = false)
	private User customer;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "restaurant_id", nullable = false)
	private Restaurant restaurant;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "delivery_address_id", nullable = false)
	private Address deliveryAddress;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 32)
	private OrderStatus status;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal subtotal;

	@Column(name = "delivery_fee", nullable = false, precision = 10, scale = 2)
	private BigDecimal deliveryFee;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal total;

	protected Order() {
	}

	public Order(User customer, Restaurant restaurant, Address deliveryAddress, BigDecimal subtotal, BigDecimal deliveryFee) {
		this.customer = customer;
		this.restaurant = restaurant;
		this.deliveryAddress = deliveryAddress;
		this.status = OrderStatus.PLACED;
		this.subtotal = subtotal;
		this.deliveryFee = deliveryFee;
		this.total = subtotal.add(deliveryFee);
	}

	public User getCustomer() {
		return customer;
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public Address getDeliveryAddress() {
		return deliveryAddress;
	}

	public OrderStatus getStatus() {
		return status;
	}

	void setStatus(OrderStatus status) {
		this.status = status;
	}

	public BigDecimal getSubtotal() {
		return subtotal;
	}

	public BigDecimal getDeliveryFee() {
		return deliveryFee;
	}

	public BigDecimal getTotal() {
		return total;
	}

}

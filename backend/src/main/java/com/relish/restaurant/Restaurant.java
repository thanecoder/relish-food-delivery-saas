package com.relish.restaurant;

import com.relish.common.BaseEntity;
import com.relish.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalTime;

@Entity
@Table(name = "restaurants")
public class Restaurant extends BaseEntity {

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "owner_user_id", nullable = false, unique = true)
	private User ownerUser;

	@Column(nullable = false)
	private String name;

	@Column(length = 1000)
	private String description;

	private String cuisineTags;

	@Column(nullable = false)
	private String addressLine;

	@Column(nullable = false)
	private String city;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 16)
	private RestaurantStatus status;

	@Column(name = "opens_at")
	private LocalTime opensAt;

	@Column(name = "closes_at")
	private LocalTime closesAt;

	protected Restaurant() {
	}

	public Restaurant(User ownerUser, String name, String addressLine, String city) {
		this.ownerUser = ownerUser;
		this.name = name;
		this.addressLine = addressLine;
		this.city = city;
		this.status = RestaurantStatus.PENDING;
	}

	public User getOwnerUser() {
		return ownerUser;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCuisineTags() {
		return cuisineTags;
	}

	public void setCuisineTags(String cuisineTags) {
		this.cuisineTags = cuisineTags;
	}

	public String getAddressLine() {
		return addressLine;
	}

	public void setAddressLine(String addressLine) {
		this.addressLine = addressLine;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public RestaurantStatus getStatus() {
		return status;
	}

	public void setStatus(RestaurantStatus status) {
		this.status = status;
	}

	public LocalTime getOpensAt() {
		return opensAt;
	}

	public void setOpensAt(LocalTime opensAt) {
		this.opensAt = opensAt;
	}

	public LocalTime getClosesAt() {
		return closesAt;
	}

	public void setClosesAt(LocalTime closesAt) {
		this.closesAt = closesAt;
	}

}

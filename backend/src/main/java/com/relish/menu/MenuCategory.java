package com.relish.menu;

import com.relish.common.BaseEntity;
import com.relish.restaurant.Restaurant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "menu_categories")
public class MenuCategory extends BaseEntity {

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "restaurant_id", nullable = false)
	private Restaurant restaurant;

	@Column(nullable = false)
	private String name;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder;

	protected MenuCategory() {
	}

	public MenuCategory(Restaurant restaurant, String name, int sortOrder) {
		this.restaurant = restaurant;
		this.name = name;
		this.sortOrder = sortOrder;
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(int sortOrder) {
		this.sortOrder = sortOrder;
	}

}

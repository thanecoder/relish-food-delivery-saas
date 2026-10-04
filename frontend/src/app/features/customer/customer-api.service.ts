import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineTags: string;
  addressLine: string;
  city: string;
  status: string;
  imageUrl: string | null;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  imageUrl: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  isDefault: boolean;
}

export interface OrderLine {
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
}

export interface OrderSummary {
  id: string;
  restaurantName: string;
  status: string;
  total: number;
  placedAt: string;
}

export interface OrderDetail extends OrderSummary {
  subtotal: number;
  deliveryFee: number;
  items: OrderLine[];
}

@Injectable({ providedIn: 'root' })
export class CustomerApiService {
  constructor(private http: HttpClient) {}

  listRestaurants() {
    return this.http.get<Restaurant[]>('/api/v1/restaurants');
  }

  getRestaurant(id: string) {
    return this.http.get<Restaurant>(`/api/v1/restaurants/${id}`);
  }

  getMenu(restaurantId: string) {
    return this.http.get<MenuCategory[]>(`/api/v1/restaurants/${restaurantId}/menu`);
  }

  listAddresses() {
    return this.http.get<Address[]>('/api/v1/addresses');
  }

  addAddress(address: { label: string; line1: string; line2?: string; city: string; isDefault: boolean }) {
    return this.http.post<Address>('/api/v1/addresses', address);
  }

  placeOrder(order: {
    restaurantId: string;
    addressId: string;
    items: { menuItemId: string; quantity: number; notes?: string }[];
  }) {
    return this.http.post<OrderDetail>('/api/v1/orders', order);
  }

  listOrders() {
    return this.http.get<OrderSummary[]>('/api/v1/orders');
  }

  getOrder(id: string) {
    return this.http.get<OrderDetail>(`/api/v1/orders/${id}`);
  }
}

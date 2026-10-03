import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface MyRestaurant {
  id: string;
  name: string;
  description: string;
  cuisineTags: string;
  addressLine: string;
  city: string;
  status: string;
  opensAt: string | null;
  closesAt: string | null;
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

@Injectable({ providedIn: 'root' })
export class RestaurantAdminApiService {
  constructor(private http: HttpClient) {}

  getMyRestaurant() {
    return this.http.get<MyRestaurant>('/api/v1/restaurant-admin/restaurant');
  }

  updateMyRestaurant(profile: { addressLine: string; city: string; opensAt: string; closesAt: string }) {
    return this.http.put<MyRestaurant>('/api/v1/restaurant-admin/restaurant', profile);
  }

  getMyMenu() {
    return this.http.get<MenuCategory[]>('/api/v1/restaurant-admin/menu');
  }

  addCategory(category: { name: string; sortOrder: number }) {
    return this.http.post<MenuCategory>('/api/v1/restaurant-admin/menu/categories', category);
  }

  updateCategory(id: string, category: { name: string; sortOrder: number }) {
    return this.http.put<MenuCategory>(`/api/v1/restaurant-admin/menu/categories/${id}`, category);
  }

  addItem(item: { categoryId: string; name: string; description: string; price: number; isVeg: boolean }) {
    return this.http.post<MenuItem>('/api/v1/restaurant-admin/menu/items', item);
  }

  updateItem(id: string, item: { name: string; description: string; price: number; isVeg: boolean }) {
    return this.http.put<MenuItem>(`/api/v1/restaurant-admin/menu/items/${id}`, item);
  }

  setAvailability(id: string, available: boolean) {
    return this.http.patch<MenuItem>(`/api/v1/restaurant-admin/menu/items/${id}/availability`, { available });
  }
}

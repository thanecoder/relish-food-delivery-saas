import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AdminRestaurant {
  id: string;
  name: string;
  cuisineTags: string | null;
  addressLine: string;
  city: string;
  status: string;
  imageUrl: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  memberSince: string;
}

@Injectable({ providedIn: 'root' })
export class PlatformAdminApiService {
  constructor(private http: HttpClient) {}

  getRestaurants() {
    return this.http.get<AdminRestaurant[]>('/api/v1/platform-admin/restaurants');
  }

  approveRestaurant(id: string) {
    return this.http.post<AdminRestaurant>(`/api/v1/platform-admin/restaurants/${id}/approve`, {});
  }

  rejectRestaurant(id: string) {
    return this.http.post<AdminRestaurant>(`/api/v1/platform-admin/restaurants/${id}/reject`, {});
  }

  getUsers() {
    return this.http.get<AdminUser[]>('/api/v1/platform-admin/users');
  }

  approveUser(id: string) {
    return this.http.post<AdminUser>(`/api/v1/platform-admin/users/${id}/approve`, {});
  }

  rejectUser(id: string) {
    return this.http.post<AdminUser>(`/api/v1/platform-admin/users/${id}/reject`, {});
  }
}

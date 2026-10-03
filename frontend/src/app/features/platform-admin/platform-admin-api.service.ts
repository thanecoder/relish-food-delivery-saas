import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface PendingRestaurant {
  id: string;
  name: string;
  cuisineTags: string | null;
  addressLine: string;
  city: string;
}

export interface PendingUser {
  id: string;
  email: string;
  name: string;
  role: string;
  memberSince: string;
}

@Injectable({ providedIn: 'root' })
export class PlatformAdminApiService {
  constructor(private http: HttpClient) {}

  getPendingRestaurants() {
    return this.http.get<PendingRestaurant[]>('/api/v1/platform-admin/restaurants/pending');
  }

  approveRestaurant(id: string) {
    return this.http.post<PendingRestaurant>(`/api/v1/platform-admin/restaurants/${id}/approve`, {});
  }

  getPendingUsers() {
    return this.http.get<PendingUser[]>('/api/v1/platform-admin/users/pending');
  }

  approveUser(id: string) {
    return this.http.post<PendingUser>(`/api/v1/platform-admin/users/${id}/approve`, {});
  }
}

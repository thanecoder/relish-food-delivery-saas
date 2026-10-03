import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  status: string;
  restaurantName: string;
  deliveryAddressLine: string;
  deliveryCity: string;
  orderStatus: string;
  total: number;
  pickedUpAt: string | null;
  deliveredAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class DeliveryApiService {
  constructor(private http: HttpClient) {}

  getMyAssignments() {
    return this.http.get<DeliveryAssignment[]>('/api/v1/delivery/assignments');
  }

  markPickedUp(id: string) {
    return this.http.post<DeliveryAssignment>(`/api/v1/delivery/assignments/${id}/picked-up`, {});
  }

  markDelivered(id: string) {
    return this.http.post<DeliveryAssignment>(`/api/v1/delivery/assignments/${id}/delivered`, {});
  }
}

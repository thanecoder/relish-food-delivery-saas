import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueueOrder, RestaurantAdminApiService } from './restaurant-admin-api.service';
import { RestaurantAdminHeader } from './restaurant-admin-header';

const STATUS_LABEL: Record<string, string> = {
  PLACED: 'New',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for pickup',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

// what the restaurant is allowed to do from each status, mirrors ADMIN_TRANSITIONS on the backend
const ACTIONS: Record<string, { label: string; to: string; primary: boolean }[]> = {
  PLACED: [
    { label: 'Accept', to: 'ACCEPTED', primary: true },
    { label: 'Reject', to: 'REJECTED', primary: false },
  ],
  ACCEPTED: [
    { label: 'Start preparing', to: 'PREPARING', primary: true },
    { label: 'Cancel', to: 'CANCELLED', primary: false },
  ],
  PREPARING: [
    { label: 'Ready for pickup', to: 'READY_FOR_PICKUP', primary: true },
    { label: 'Cancel', to: 'CANCELLED', primary: false },
  ],
};

@Component({
  selector: 'app-restaurant-admin-orders',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatProgressSpinnerModule, RestaurantAdminHeader],
  templateUrl: './restaurant-admin-orders.html',
  styleUrl: './restaurant-admin-orders.scss',
})
export class RestaurantAdminOrders implements OnInit {
  orders = signal<QueueOrder[]>([]);
  loading = signal(true);
  updating = signal<string | null>(null);

  constructor(private api: RestaurantAdminApiService) {}

  ngOnInit() {
    this.api.getOrders().subscribe({
      next: (list) => {
        this.orders.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusLabel(status: string) {
    return STATUS_LABEL[status] ?? status;
  }

  actionsFor(status: string) {
    return ACTIONS[status] ?? [];
  }

  move(order: QueueOrder, to: string) {
    this.updating.set(order.id);
    this.api.updateOrderStatus(order.id, to).subscribe({
      next: (updated) => {
        this.orders.set(this.orders().map((o) => (o.id === updated.id ? updated : o)));
        this.updating.set(null);
      },
      error: () => this.updating.set(null),
    });
  }
}

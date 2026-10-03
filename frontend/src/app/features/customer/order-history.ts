import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerApiService, OrderSummary } from './customer-api.service';
import { CustomerHeader } from './customer-header';

const STATUS_LABEL: Record<string, string> = {
  PLACED: 'Placed',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for pickup',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

@Component({
  selector: 'app-order-history',
  imports: [DatePipe, DecimalPipe, MatProgressSpinnerModule, CustomerHeader],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistory implements OnInit {
  orders = signal<OrderSummary[]>([]);
  loading = signal(true);

  constructor(
    private api: CustomerApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.api.listOrders().subscribe({
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

  open(o: OrderSummary) {
    this.router.navigate(['/customer/orders', o.id]);
  }
}

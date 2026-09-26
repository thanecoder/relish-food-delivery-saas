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
  template: `
    <app-customer-header></app-customer-header>

    <div class="page">
      <h1>Your orders</h1>

      @if (loading()) {
        <div class="center">
          <mat-spinner diameter="32"></mat-spinner>
        </div>
      } @else if (orders().length === 0) {
        <p class="empty">No orders yet.</p>
      } @else {
        <div class="grid">
          @for (o of orders(); track o.id) {
            <button class="order" (click)="open(o)">
              <div class="left">
                <div class="rest">{{ o.restaurantName }}</div>
                <div class="date">{{ o.placedAt | date: 'MMM d, h:mm a' }}</div>
              </div>
              <div class="right">
                <span class="status" [class]="'s-' + o.status.toLowerCase()">{{ statusLabel(o.status) }}</span>
                <span class="total">\${{ o.total | number: '1.2-2' }}</span>
              </div>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .page {
      max-width: 1020px;
      margin: 0 auto;
      padding: 32px 20px 60px;
    }
    h1 {
      margin: 0 0 20px;
      font-size: 1.6rem;
    }
    .center {
      display: flex;
      justify-content: center;
      padding: 60px 0;
    }
    .empty {
      color: var(--mat-sys-on-surface-variant);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 14px;
    }
    .order {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      padding: 16px 18px;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 14px;
      background: var(--mat-sys-surface);
      cursor: pointer;
      font-family: inherit;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
    }
    .order:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    }
    .rest {
      font-weight: 600;
    }
    .date {
      font-size: 0.8rem;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 2px;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .status {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 2px 8px;
      border-radius: 20px;
      background: var(--mat-sys-surface-variant);
      color: var(--mat-sys-on-surface-variant);
    }
    .status.s-delivered {
      background: color-mix(in srgb, #2e7d32 18%, transparent);
      color: #2e7d32;
    }
    .status.s-rejected,
    .status.s-cancelled {
      background: color-mix(in srgb, var(--mat-sys-error) 18%, transparent);
      color: var(--mat-sys-error);
    }
    .total {
      font-weight: 600;
      font-size: 0.9rem;
    }
  `,
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

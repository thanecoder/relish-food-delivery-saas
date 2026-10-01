import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerApiService, OrderDetail as OrderDetailModel } from './customer-api.service';
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

const STEPS = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];

@Component({
  selector: 'app-order-detail',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CustomerHeader],
  template: `
    <app-customer-header></app-customer-header>

    @if (loading()) {
      <div class="center">
        <mat-spinner diameter="32"></mat-spinner>
      </div>
    } @else if (order()) {
      <div class="layout">
        <div class="main-col">
          <button mat-button class="back" (click)="back()">
            <mat-icon>arrow_back</mat-icon> Your orders
          </button>

          <h1>{{ order()!.restaurantName }}</h1>
          <p class="sub">{{ order()!.placedAt | date: 'medium' }}</p>

          @if (stepIndex() >= 0 && !isTerminalFailure()) {
            <div class="steps">
              @for (s of steps; track s; let i = $index) {
                <div class="step" [class.done]="i <= stepIndex()">
                  <div class="dot"></div>
                  <span>{{ statusLabel(s) }}</span>
                </div>
              }
            </div>
          } @else {
            <p class="status-line" [class.bad]="isTerminalFailure()">{{ statusLabel(order()!.status) }}</p>
          }

          <section class="block">
            <h2>Items</h2>
            <div class="lines">
              @for (item of order()!.items; track item.menuItemName) {
                <div class="line">
                  <span class="qty">{{ item.quantity }}&times;</span>
                  <span class="name">{{ item.menuItemName }}</span>
                  <span class="amt">&#8377;{{ item.unitPrice * item.quantity | number: '1.2-2' }}</span>
                </div>
              }
            </div>
          </section>
        </div>

        <aside class="summary-col">
          <div class="summary-card">
            <h2>Receipt</h2>
            <div class="row"><span>Subtotal</span><span>&#8377;{{ order()!.subtotal | number: '1.2-2' }}</span></div>
            <div class="row"><span>Delivery fee</span><span>&#8377;{{ order()!.deliveryFee | number: '1.2-2' }}</span></div>
            <div class="row grand"><span>Total</span><span>&#8377;{{ order()!.total | number: '1.2-2' }}</span></div>
          </div>
        </aside>
      </div>
    }
  `,
  styles: `
    .center {
      display: flex;
      justify-content: center;
      padding: 60px 0;
    }
    .layout {
      display: flex;
      align-items: flex-start;
      gap: 36px;
      max-width: 1020px;
      margin: 0 auto;
      padding: 16px 20px 60px;
    }
    .main-col {
      flex: 1;
      min-width: 0;
    }
    .back {
      margin-left: -8px;
      color: var(--mat-sys-on-surface-variant);
    }
    h1 {
      margin: 8px 0 2px;
      font-size: 1.5rem;
    }
    .sub {
      margin: 0 0 20px;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
    }
    .steps {
      display: flex;
      justify-content: space-between;
      margin-bottom: 26px;
      position: relative;
    }
    .steps::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      height: 2px;
      background: var(--mat-sys-outline-variant);
      z-index: 0;
    }
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;
      position: relative;
      z-index: 1;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--mat-sys-outline-variant);
    }
    .step.done .dot {
      background: var(--mat-sys-primary);
    }
    .step span {
      font-size: 0.65rem;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
      max-width: 70px;
    }
    .step.done span {
      color: var(--mat-sys-on-surface);
      font-weight: 600;
    }
    .status-line {
      font-weight: 700;
      margin-bottom: 20px;
    }
    .block {
      margin-bottom: 20px;
    }
    .status-line.bad {
      color: var(--mat-sys-error);
    }
    .block h2 {
      font-size: 1.05rem;
      margin: 0 0 12px;
    }
    .lines {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
      padding: 4px 14px;
    }
    .line {
      display: flex;
      gap: 10px;
      padding: 8px 0;
      font-size: 0.92rem;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .line:last-child {
      border-bottom: none;
    }
    .qty {
      color: var(--mat-sys-on-surface-variant);
      width: 26px;
    }
    .name {
      flex: 1;
    }

    .summary-col {
      width: 300px;
      flex-shrink: 0;
      position: sticky;
      top: 84px;
    }
    .summary-card {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 16px;
      padding: 20px;
      background: var(--mat-sys-surface);
    }
    .summary-card h2 {
      margin: 0 0 12px;
      font-size: 1.05rem;
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      color: var(--mat-sys-on-surface-variant);
      padding: 3px 0;
    }
    .row.grand {
      color: var(--mat-sys-on-surface);
      font-weight: 700;
      font-size: 1rem;
      border-top: 1px solid var(--mat-sys-outline-variant);
      margin-top: 4px;
      padding-top: 8px;
    }

    @media (max-width: 900px) {
      .layout {
        flex-direction: column;
      }
      .summary-col {
        width: 100%;
        position: static;
      }
    }
  `,
})
export class OrderDetail implements OnInit {
  order = signal<OrderDetailModel | null>(null);
  loading = signal(true);
  steps = STEPS;

  constructor(
    private api: CustomerApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getOrder(id).subscribe({
      next: (o) => {
        this.order.set(o);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  stepIndex() {
    return STEPS.indexOf(this.order()?.status ?? '');
  }

  isTerminalFailure() {
    const status = this.order()?.status;
    return status === 'REJECTED' || status === 'CANCELLED';
  }

  statusLabel(status: string) {
    return STATUS_LABEL[status] ?? status;
  }

  back() {
    this.router.navigate(['/customer/orders']);
  }
}

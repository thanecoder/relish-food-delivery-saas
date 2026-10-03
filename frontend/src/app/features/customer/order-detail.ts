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
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
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

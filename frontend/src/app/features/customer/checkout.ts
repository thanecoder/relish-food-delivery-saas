import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { Address, CustomerApiService } from './customer-api.service';
import { CartService } from './cart.service';
import { CustomerHeader } from './customer-header';

@Component({
  selector: 'app-checkout',
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    CustomerHeader,
  ],
  template: `
    <app-customer-header></app-customer-header>

    @if (cart.lines().length === 0) {
      <div class="page-narrow">
        <p class="empty">Your cart is empty. <a (click)="browse()">Browse restaurants</a></p>
      </div>
    } @else {
      <div class="layout">
        <div class="main-col">
          <button mat-button class="back" (click)="backToMenu()">
            <mat-icon>arrow_back</mat-icon> Back to menu
          </button>

          <h1>Checkout</h1>
          <p class="restaurant-name">Order from {{ cart.restaurantName() }}</p>

          <section class="block">
            <h2>Items</h2>
            <div class="lines">
              @for (line of cart.lines(); track line.item.id) {
                <div class="line">
                  <span class="qty">{{ line.quantity }}&times;</span>
                  <span class="name">{{ line.item.name }}</span>
                  <span class="amt">\${{ line.item.price * line.quantity | number: '1.2-2' }}</span>
                </div>
              }
            </div>
          </section>

          <section class="block">
            <h2>Deliver to</h2>

            @if (loadingAddresses()) {
              <mat-spinner diameter="24"></mat-spinner>
            } @else {
              @if (addresses().length > 0) {
                <mat-radio-group [(ngModel)]="selectedAddressId" class="addr-group">
                  @for (a of addresses(); track a.id) {
                    <label class="addr">
                      <mat-radio-button [value]="a.id"></mat-radio-button>
                      <span>
                        <strong>{{ a.label }}</strong> &mdash; {{ a.line1 }}@if (a.line2) {, {{ a.line2 }}}, {{ a.city }}
                      </span>
                    </label>
                  }
                </mat-radio-group>
              }

              @if (!showNewAddress()) {
                <button mat-button (click)="showNewAddress.set(true)">
                  <mat-icon>add</mat-icon> Add a new address
                </button>
              } @else {
                <form [formGroup]="addressForm" class="addr-form" (ngSubmit)="saveAddress()">
                  <input formControlName="label" placeholder="Label (e.g. Home)" />
                  <input formControlName="line1" placeholder="Address line 1" />
                  <input formControlName="line2" placeholder="Address line 2 (optional)" />
                  <input formControlName="city" placeholder="City" />
                  <div class="addr-form-actions">
                    <button type="button" mat-button (click)="showNewAddress.set(false)">Cancel</button>
                    <button type="submit" mat-stroked-button [disabled]="addressForm.invalid || savingAddress()">
                      Save address
                    </button>
                  </div>
                </form>
              }
            }
          </section>
        </div>

        <aside class="summary-col">
          <div class="summary-card">
            <h2>Order summary</h2>
            <div class="totals">
              <div class="row"><span>Subtotal</span><span>\${{ cart.subtotal() | number: '1.2-2' }}</span></div>
              <div class="row"><span>Delivery fee</span><span>\$2.99</span></div>
              <div class="row grand"><span>Total</span><span>\${{ cart.subtotal() + 2.99 | number: '1.2-2' }}</span></div>
            </div>

            @if (errorMsg()) {
              <p class="error">{{ errorMsg() }}</p>
            }

            <button
              mat-flat-button
              color="primary"
              class="place"
              [disabled]="!selectedAddressId || placing()"
              (click)="placeOrder()"
            >
              @if (placing()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Place order &middot; \${{ cart.subtotal() + 2.99 | number: '1.2-2' }}
              }
            </button>
          </div>
        </aside>
      </div>
    }
  `,
  styles: `
    .page-narrow {
      max-width: 480px;
      margin: 0 auto;
      padding: 80px 20px;
      text-align: center;
    }
    .empty {
      color: var(--mat-sys-on-surface-variant);
    }
    .empty a {
      color: var(--mat-sys-primary);
      cursor: pointer;
    }
    .layout {
      display: flex;
      align-items: flex-start;
      gap: 36px;
      max-width: 1020px;
      margin: 0 auto;
      padding: 28px 20px 60px;
    }
    .main-col {
      flex: 1;
      min-width: 0;
    }
    .back {
      margin: 0 0 8px -8px;
      color: var(--mat-sys-on-surface-variant);
    }
    h1 {
      margin: 0 0 4px;
      font-size: 1.6rem;
    }
    .restaurant-name {
      color: var(--mat-sys-on-surface-variant);
      margin: 0 0 28px;
    }
    .block {
      margin-bottom: 28px;
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
    .addr-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 8px;
    }
    .addr {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 6px 4px;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .addr-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 10px 0;
    }
    .addr-form input {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1.5px solid var(--mat-sys-outline);
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      font-family: inherit;
      font-size: 0.9rem;
    }
    .addr-form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .summary-col {
      width: 320px;
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
    .error {
      color: var(--mat-sys-error);
      font-size: 0.85rem;
      margin: 12px 0 0;
    }
    .place {
      width: 100%;
      height: 46px;
      margin-top: 16px;
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
export class Checkout implements OnInit {
  addresses = signal<Address[]>([]);
  loadingAddresses = signal(true);
  showNewAddress = signal(false);
  savingAddress = signal(false);
  placing = signal(false);
  errorMsg = signal<string | null>(null);
  selectedAddressId: string | null = null;

  private fb = inject(FormBuilder);
  addressForm = this.fb.group({
    label: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
  });

  constructor(
    protected cart: CartService,
    private api: CustomerApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.cart.lines().length === 0) {
      this.loadingAddresses.set(false);
      return;
    }
    this.api.listAddresses().subscribe({
      next: (list) => {
        this.addresses.set(list);
        const preferred = list.find((a) => a.isDefault) ?? list[0];
        this.selectedAddressId = preferred?.id ?? null;
        this.showNewAddress.set(list.length === 0);
        this.loadingAddresses.set(false);
      },
      error: () => this.loadingAddresses.set(false),
    });
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      return;
    }
    this.savingAddress.set(true);
    const value = this.addressForm.getRawValue();
    this.api
      .addAddress({
        label: value.label!,
        line1: value.line1!,
        line2: value.line2 || undefined,
        city: value.city!,
        isDefault: this.addresses().length === 0,
      })
      .subscribe({
        next: (created) => {
          this.addresses.set([...this.addresses(), created]);
          this.selectedAddressId = created.id;
          this.showNewAddress.set(false);
          this.addressForm.reset();
          this.savingAddress.set(false);
        },
        error: () => this.savingAddress.set(false),
      });
  }

  placeOrder() {
    if (!this.selectedAddressId || !this.cart.restaurantId()) {
      return;
    }
    this.placing.set(true);
    this.errorMsg.set(null);
    this.api
      .placeOrder({
        restaurantId: this.cart.restaurantId()!,
        addressId: this.selectedAddressId,
        items: this.cart.lines().map((l) => ({ menuItemId: l.item.id, quantity: l.quantity })),
      })
      .subscribe({
        next: (order) => {
          this.cart.clear();
          this.router.navigate(['/customer/orders', order.id]);
        },
        error: () => {
          this.errorMsg.set("Couldn't place the order, please try again.");
          this.placing.set(false);
        },
      });
  }

  browse() {
    this.router.navigate(['/customer']);
  }

  backToMenu() {
    const restaurantId = this.cart.restaurantId();
    if (restaurantId) {
      this.router.navigate(['/customer/restaurants', restaurantId]);
    } else {
      this.browse();
    }
  }
}

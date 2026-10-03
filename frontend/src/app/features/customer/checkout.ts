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
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
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

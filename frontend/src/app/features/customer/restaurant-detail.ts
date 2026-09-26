import { DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerApiService, MenuCategory, MenuItem, Restaurant } from './customer-api.service';
import { CartService } from './cart.service';
import { CustomerHeader } from './customer-header';

@Component({
  selector: 'app-restaurant-detail',
  imports: [DecimalPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CustomerHeader],
  template: `
    <app-customer-header></app-customer-header>

    @if (loading()) {
      <div class="center">
        <mat-spinner diameter="32"></mat-spinner>
      </div>
    } @else if (restaurant()) {
      <div class="layout">
        <div class="menu-col">
          <button mat-button class="back" (click)="back()">
            <mat-icon>arrow_back</mat-icon> All restaurants
          </button>

          <h1>{{ restaurant()!.name }}</h1>
          <p class="sub">{{ restaurant()!.cuisineTags }} &middot; {{ restaurant()!.addressLine }}, {{ restaurant()!.city }}</p>
          @if (restaurant()!.description) {
            <p class="desc">{{ restaurant()!.description }}</p>
          }

          @for (cat of categories(); track cat.id) {
            <section class="cat">
              <h2>{{ cat.name }}</h2>
              <div class="items">
                @for (item of cat.items; track item.id) {
                  <div class="item" [class.unavailable]="!item.isAvailable">
                    <div class="info">
                      <div class="name">
                        {{ item.name }}
                        @if (item.isVeg) {
                          <span class="veg" title="Vegetarian"></span>
                        }
                      </div>
                      @if (item.description) {
                        <div class="idesc">{{ item.description }}</div>
                      }
                      <div class="price">\${{ item.price | number: '1.2-2' }}</div>
                    </div>
                    <div class="action">
                      @if (qtyInCart(item.id) > 0) {
                        <div class="stepper">
                          <button mat-icon-button (click)="dec(item)"><mat-icon>remove</mat-icon></button>
                          <span>{{ qtyInCart(item.id) }}</span>
                          <button mat-icon-button (click)="add(item)"><mat-icon>add</mat-icon></button>
                        </div>
                      } @else {
                        <button mat-stroked-button [disabled]="!item.isAvailable" (click)="add(item)">
                          {{ item.isAvailable ? 'Add' : 'Sold out' }}
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        </div>

        <aside class="cart-col">
          <div class="cart-card">
            <h2>Your order</h2>
            @if (cart.itemCount() === 0) {
              <p class="empty-cart">Add items from the menu to start an order.</p>
            } @else {
              <div class="cart-lines">
                @for (line of cart.lines(); track line.item.id) {
                  <div class="cart-line">
                    <span class="cl-qty">{{ line.quantity }}&times;</span>
                    <span class="cl-name">{{ line.item.name }}</span>
                    <span class="cl-amt">\${{ line.item.price * line.quantity | number: '1.2-2' }}</span>
                  </div>
                }
              </div>
              <div class="cart-totals">
                <div class="row"><span>Subtotal</span><span>\${{ cart.subtotal() | number: '1.2-2' }}</span></div>
                <div class="row"><span>Delivery fee</span><span>\$2.99</span></div>
                <div class="row grand"><span>Total</span><span>\${{ cart.subtotal() + 2.99 | number: '1.2-2' }}</span></div>
              </div>
              <button mat-flat-button color="primary" class="checkout-btn" (click)="goToCheckout()">
                Go to checkout
              </button>
            }
          </div>
        </aside>
      </div>

      @if (cart.itemCount() > 0) {
        <div class="cart-bar">
          <span>{{ cart.itemCount() }} item{{ cart.itemCount() === 1 ? '' : 's' }} &middot; \${{ cart.subtotal() | number: '1.2-2' }}</span>
          <button mat-flat-button color="primary" (click)="goToCheckout()">View cart</button>
        </div>
      }
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
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px 20px 60px;
    }
    .menu-col {
      flex: 1;
      min-width: 0;
    }
    .back {
      margin-left: -8px;
      color: var(--mat-sys-on-surface-variant);
    }
    h1 {
      margin: 8px 0 2px;
      font-size: 1.6rem;
    }
    .sub {
      margin: 0 0 8px;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }
    .desc {
      margin: 0 0 20px;
      font-size: 0.9rem;
    }
    .cat h2 {
      font-size: 1.05rem;
      margin: 24px 0 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .item:last-child {
      border-bottom: none;
    }
    .item.unavailable {
      opacity: 0.55;
    }
    .name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .veg {
      width: 10px;
      height: 10px;
      border: 1.5px solid #2e7d32;
      border-radius: 2px;
      display: inline-block;
      position: relative;
    }
    .veg::after {
      content: '';
      position: absolute;
      inset: 1.5px;
      background: #2e7d32;
      border-radius: 50%;
    }
    .idesc {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.8rem;
      margin: 2px 0 6px;
      max-width: 420px;
    }
    .price {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .action {
      flex-shrink: 0;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .stepper span {
      min-width: 20px;
      text-align: center;
      font-weight: 600;
    }

    .cart-col {
      width: 320px;
      flex-shrink: 0;
      position: sticky;
      top: 84px;
    }
    .cart-card {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 16px;
      padding: 20px;
      background: var(--mat-sys-surface);
    }
    .cart-card h2 {
      margin: 0 0 12px;
      font-size: 1.05rem;
    }
    .empty-cart {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.88rem;
    }
    .cart-lines {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 14px;
    }
    .cart-line {
      display: flex;
      gap: 8px;
      font-size: 0.85rem;
    }
    .cl-qty {
      color: var(--mat-sys-on-surface-variant);
      width: 22px;
    }
    .cl-name {
      flex: 1;
    }
    .cart-totals {
      border-top: 1px solid var(--mat-sys-outline-variant);
      padding-top: 10px;
      margin-bottom: 14px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: 0.86rem;
      color: var(--mat-sys-on-surface-variant);
      padding: 3px 0;
    }
    .row.grand {
      color: var(--mat-sys-on-surface);
      font-weight: 700;
      font-size: 0.98rem;
      border-top: 1px solid var(--mat-sys-outline-variant);
      margin-top: 4px;
      padding-top: 8px;
    }
    .checkout-btn {
      width: 100%;
      height: 44px;
    }

    .cart-bar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      justify-content: space-between;
      align-items: center;
      padding: 14px 24px;
    }
    .cart-bar button {
      background: var(--mat-sys-on-primary);
      color: var(--mat-sys-primary);
    }

    @media (max-width: 900px) {
      .layout {
        flex-direction: column;
      }
      .cart-col {
        display: none;
      }
      .cart-bar {
        display: flex;
      }
    }
  `,
})
export class RestaurantDetail implements OnInit {
  restaurant = signal<Restaurant | null>(null);
  categories = signal<MenuCategory[]>([]);
  loading = signal(true);
  private restaurantId!: string;

  constructor(
    private api: CustomerApiService,
    protected cart: CartService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.restaurantId = this.route.snapshot.paramMap.get('id')!;
    this.api.getRestaurant(this.restaurantId).subscribe((r) => this.restaurant.set(r));
    this.api.getMenu(this.restaurantId).subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  qtyInCart(itemId: string) {
    return this.cart.lines().find((l) => l.item.id === itemId)?.quantity ?? 0;
  }

  add(item: MenuItem) {
    this.cart.add(this.restaurantId, this.restaurant()?.name ?? '', item);
  }

  dec(item: MenuItem) {
    this.cart.setQuantity(item.id, this.qtyInCart(item.id) - 1);
  }

  goToCheckout() {
    this.router.navigate(['/customer/checkout']);
  }

  back() {
    this.router.navigate(['/customer']);
  }
}

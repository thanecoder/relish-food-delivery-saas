import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from './cart.service';

@Component({
  selector: 'app-customer-header',
  imports: [RouterLink, RouterLinkActive, MatBadgeModule, MatButtonModule, MatIconModule],
  template: `
    <header class="bar">
      <a routerLink="/customer" class="brand">Relish</a>

      <nav class="links">
        <a routerLink="/customer" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Restaurants
        </a>
        <a routerLink="/customer/orders" routerLinkActive="active">Orders</a>
      </nav>

      <div class="spacer"></div>

      <a mat-icon-button routerLink="/customer/checkout" aria-label="Cart"
         [matBadge]="cart.itemCount() || null" matBadgeColor="primary" matBadgeSize="small">
        <mat-icon>shopping_cart</mat-icon>
      </a>
      <a mat-icon-button routerLink="/customer/account" aria-label="Account">
        <mat-icon>account_circle</mat-icon>
      </a>
      <button mat-button (click)="logout()">Log out</button>
    </header>
  `,
  styles: `
    .bar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface);
    }
    .brand {
      font-weight: 800;
      font-size: 1.25rem;
      color: var(--mat-sys-primary);
      text-decoration: none;
      margin-right: 28px;
    }
    .links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .links a {
      color: var(--mat-sys-on-surface-variant);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 20px;
      transition: background 0.12s ease, color 0.12s ease;
    }
    .links a:hover {
      background: var(--mat-sys-surface-variant);
    }
    .links a.active {
      color: var(--mat-sys-primary);
      background: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent);
    }
    .spacer {
      flex: 1;
    }

    @media (max-width: 600px) {
      .brand {
        margin-right: 12px;
      }
      .links a {
        padding: 8px;
        font-size: 0.82rem;
      }
    }
  `,
})
export class CustomerHeader {
  constructor(
    protected cart: CartService,
    private auth: AuthService,
    private router: Router,
  ) {}

  async logout() {
    await this.auth.logout();
    this.cart.clear();
    this.router.navigate(['/auth']);
  }
}

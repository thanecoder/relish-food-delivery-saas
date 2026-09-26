import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from './cart.service';

@Component({
  selector: 'app-customer-header',
  imports: [RouterLink, MatBadgeModule, MatButtonModule, MatIconModule],
  template: `
    <header class="bar">
      <a routerLink="/customer" class="brand">Relish</a>
      <div class="spacer"></div>
      <a mat-icon-button routerLink="/customer/orders" aria-label="Order history">
        <mat-icon>receipt_long</mat-icon>
      </a>
      <a mat-icon-button routerLink="/customer/checkout" aria-label="Cart"
         [matBadge]="cart.itemCount() || null" matBadgeColor="primary" matBadgeSize="small">
        <mat-icon>shopping_cart</mat-icon>
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
    }
    .spacer {
      flex: 1;
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

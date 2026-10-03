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
  templateUrl: './customer-header.html',
  styleUrl: './customer-header.scss',
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

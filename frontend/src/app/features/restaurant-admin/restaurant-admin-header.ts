import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { Avatar } from '../../core/ui/avatar';

@Component({
  selector: 'app-restaurant-admin-header',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, Avatar],
  templateUrl: './restaurant-admin-header.html',
  styleUrl: './restaurant-admin-header.scss',
})
export class RestaurantAdminHeader {
  constructor(
    protected auth: AuthService,
    private router: Router,
  ) {}

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth']);
  }
}

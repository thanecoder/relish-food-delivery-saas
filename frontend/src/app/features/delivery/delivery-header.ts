import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { Avatar } from '../../core/ui/avatar';

@Component({
  selector: 'app-delivery-header',
  imports: [MatButtonModule, Avatar],
  templateUrl: './delivery-header.html',
  styleUrl: './delivery-header.scss',
})
export class DeliveryHeader {
  constructor(
    protected auth: AuthService,
    private router: Router,
  ) {}

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth']);
  }
}

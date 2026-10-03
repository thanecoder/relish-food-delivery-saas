import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-platform-admin-header',
  imports: [MatButtonModule],
  templateUrl: './platform-admin-header.html',
  styleUrl: './platform-admin-header.scss',
})
export class PlatformAdminHeader {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth']);
  }
}

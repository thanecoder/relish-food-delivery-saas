import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';

const WAITING_ON: Record<string, string> = {
  RESTAURANT_ADMIN:
    "We're reviewing your restaurant's application. Once it's approved you'll be able to set up your menu and start taking orders.",
  DELIVERY_PARTNER:
    "We're reviewing your application to deliver with Relish. Once it's approved you'll start seeing delivery jobs here.",
};

@Component({
  selector: 'app-pending-review',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './pending-review.html',
  styleUrl: './pending-review.scss',
})
export class PendingReview {
  message: string;
  email: string;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    const user = this.auth.user();
    this.email = user?.email ?? '';
    this.message =
      (user?.role && WAITING_ON[user.role]) ?? "Your account is being reviewed. We'll email you once it's sorted.";
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth']);
  }
}

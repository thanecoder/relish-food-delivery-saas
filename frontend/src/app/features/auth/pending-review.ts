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
  template: `
    <div class="wrap">
      <mat-card class="card">
        <mat-icon class="badge">hourglass_top</mat-icon>
        <h1>Application under review</h1>
        <p class="sub">{{ message }}</p>
        <p class="who">Signed in as {{ email }}</p>
        <button mat-flat-button color="primary" class="out" (click)="logout()">Log out</button>
      </mat-card>
    </div>
  `,
  styles: `
    .wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .card {
      width: 100%;
      max-width: 420px;
      padding: 36px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 6px;
    }
    .badge {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--mat-sys-primary);
      margin-bottom: 6px;
    }
    h1 {
      margin: 0;
      font-size: 1.4rem;
    }
    .sub {
      margin: 6px 0 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }
    .who {
      margin: 14px 0 0;
      font-size: 0.8rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .out {
      margin-top: 18px;
      height: 42px;
      align-self: stretch;
    }
  `,
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

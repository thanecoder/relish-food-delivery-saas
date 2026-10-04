import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountProfile, AuthService } from '../../core/auth/auth.service';
import { Avatar } from '../../core/ui/avatar';
import { CustomerHeader } from './customer-header';

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: 'Customer',
  RESTAURANT_ADMIN: 'Restaurant Admin',
  DELIVERY_PARTNER: 'Delivery Partner',
  PLATFORM_ADMIN: 'Platform Admin',
};

@Component({
  selector: 'app-account',
  imports: [DatePipe, MatButtonModule, MatProgressSpinnerModule, Avatar, CustomerHeader],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit {
  profile = signal<AccountProfile | null>(null);
  loading = signal(true);
  confirming = signal(false);
  deleting = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.auth.getAccount().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  roleLabel(role: string) {
    return ROLE_LABEL[role] ?? role;
  }

  async deleteAccount() {
    this.deleting.set(true);
    this.errorMsg.set(null);
    try {
      await this.auth.deleteAccount();
      this.router.navigate(['/auth']);
    } catch (err: unknown) {
      const message = (err as { error?: { message?: string } })?.error?.message;
      this.errorMsg.set(message ?? 'Could not delete your account, please try again.');
      this.deleting.set(false);
    }
  }
}

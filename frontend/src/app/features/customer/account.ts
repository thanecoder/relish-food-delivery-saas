import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountProfile, AuthService } from '../../core/auth/auth.service';
import { CustomerHeader } from './customer-header';

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: 'Customer',
  RESTAURANT_ADMIN: 'Restaurant Admin',
  DELIVERY_PARTNER: 'Delivery Partner',
  PLATFORM_ADMIN: 'Platform Admin',
};

@Component({
  selector: 'app-account',
  imports: [DatePipe, MatButtonModule, MatProgressSpinnerModule, CustomerHeader],
  template: `
    <app-customer-header></app-customer-header>

    <div class="page">
      <h1>Account</h1>

      @if (loading()) {
        <div class="center">
          <mat-spinner diameter="32"></mat-spinner>
        </div>
      } @else if (profile()) {
        <div class="card">
          <div class="row"><span class="label">Email</span><span>{{ profile()!.email }}</span></div>
          <div class="row"><span class="label">Role</span><span>{{ roleLabel(profile()!.role) }}</span></div>
          <div class="row"><span class="label">Member since</span><span>{{ profile()!.memberSince | date: 'mediumDate' }}</span></div>
        </div>

        <section class="danger">
          <h2>Danger zone</h2>

          @if (!confirming()) {
            <p class="hint">
              Deleting your account permanently removes your profile, saved addresses, and order
              history from Relish. This can't be undone.
            </p>
            <button mat-stroked-button color="warn" (click)="confirming.set(true)">Delete my account</button>
          } @else {
            <div class="confirm-box">
              <p>
                <strong>Are you sure?</strong> This deletes your account and everything tied to it -
                addresses, order history, all of it. There's no getting it back after this.
              </p>
              @if (errorMsg()) {
                <p class="error">{{ errorMsg() }}</p>
              }
              <div class="confirm-actions">
                <button mat-button [disabled]="deleting()" (click)="confirming.set(false)">Cancel</button>
                <button mat-flat-button color="warn" [disabled]="deleting()" (click)="deleteAccount()">
                  @if (deleting()) {
                    <mat-spinner diameter="18"></mat-spinner>
                  } @else {
                    Yes, delete my account
                  }
                </button>
              </div>
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: `
    .page {
      max-width: 640px;
      margin: 0 auto;
      padding: 32px 20px 60px;
    }
    h1 {
      margin: 0 0 20px;
      font-size: 1.6rem;
    }
    .center {
      display: flex;
      justify-content: center;
      padding: 60px 0;
    }
    .card {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 14px;
      padding: 6px 20px;
      background: var(--mat-sys-surface);
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      font-size: 0.92rem;
    }
    .row:last-child {
      border-bottom: none;
    }
    .label {
      color: var(--mat-sys-on-surface-variant);
    }
    .danger {
      margin-top: 36px;
      padding-top: 24px;
      border-top: 1px solid var(--mat-sys-outline-variant);
    }
    .danger h2 {
      font-size: 1.05rem;
      margin: 0 0 10px;
      color: var(--mat-sys-error);
    }
    .hint {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.88rem;
      margin: 0 0 14px;
      max-width: 480px;
    }
    .confirm-box {
      border: 1px solid var(--mat-sys-error);
      border-radius: 12px;
      padding: 16px 18px;
      background: color-mix(in srgb, var(--mat-sys-error) 6%, transparent);
    }
    .confirm-box p {
      margin: 0 0 4px;
      font-size: 0.9rem;
    }
    .error {
      color: var(--mat-sys-error);
      font-size: 0.85rem;
      margin: 8px 0 0 !important;
    }
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 14px;
    }
  `,
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

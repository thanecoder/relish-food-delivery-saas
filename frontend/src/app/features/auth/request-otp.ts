import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';
import { AuthLayout } from './auth-layout';

@Component({
  selector: 'app-request-otp',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AuthLayout,
  ],
  template: `
    <app-auth-layout>
      <h1>Log in or sign up</h1>
      <p class="sub">Enter your email and we'll send you a code. No password to remember.</p>

      <mat-form-field appearance="outline" class="field">
        <mat-label>Email</mat-label>
        <input matInput type="email" [formControl]="email" (keydown.enter)="submit()" />
        @if (email.invalid && email.touched) {
          <mat-error>Enter a valid email</mat-error>
        }
      </mat-form-field>

      @if (errorMsg()) {
        <p class="error">{{ errorMsg() }}</p>
      }

      <button
        mat-flat-button
        color="primary"
        class="submit"
        [disabled]="email.invalid || loading()"
        (click)="submit()"
      >
        @if (loading()) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          Send code
        }
      </button>

      <p class="legal">
        By continuing you agree to our <a routerLink="/terms">Terms &amp; Conditions</a>.
      </p>
    </app-auth-layout>
  `,
  styles: `
    h1 {
      margin: 0 0 6px;
      font-size: 1.75rem;
    }
    .sub {
      margin: 0 0 26px;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.92rem;
    }
    .field {
      width: 100%;
    }
    .submit {
      width: 100%;
      height: 46px;
      margin-top: 4px;
    }
    .error {
      color: var(--mat-sys-error);
      font-size: 0.85rem;
      margin: 0 0 10px;
    }
    .legal {
      margin: 20px 0 0;
      font-size: 0.78rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .legal a {
      color: var(--mat-sys-primary);
    }
  `,
})
export class RequestOtp {
  email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit() {
    if (this.email.invalid || this.loading()) {
      return;
    }
    this.loading.set(true);
    this.errorMsg.set(null);
    this.auth.requestOtp(this.email.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/auth/verify'], { queryParams: { email: this.email.value } });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err?.status === 429
            ? (err?.error?.message ?? 'Too many code requests, please wait a bit.')
            : 'Could not send the code, try again in a bit.',
        );
      },
    });
  }
}

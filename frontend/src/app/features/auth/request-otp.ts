import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-request-otp',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="wrap">
      <mat-card class="card">
        <h1>Relish</h1>
        <p class="sub">Enter your email, we'll send you a code to log in. No password needed.</p>

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
      max-width: 380px;
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 1.6rem;
    }
    .sub {
      margin: 0 0 16px;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }
    .field {
      width: 100%;
    }
    .submit {
      margin-top: 8px;
      height: 44px;
    }
    .error {
      color: var(--mat-sys-error);
      font-size: 0.85rem;
      margin: 0 0 4px;
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
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Could not send the code, try again in a bit.');
      },
    });
  }
}

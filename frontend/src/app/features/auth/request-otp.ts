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
  templateUrl: './request-otp.html',
  styleUrl: './request-otp.scss',
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

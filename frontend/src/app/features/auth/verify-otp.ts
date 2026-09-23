import { Component, ElementRef, computed, signal, viewChildren } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

const ROLE_HOME: Record<string, string> = {
  CUSTOMER: '/customer',
  RESTAURANT_ADMIN: '/restaurant-admin',
  DELIVERY_PARTNER: '/delivery',
  PLATFORM_ADMIN: '/admin',
};

const BOX_COUNT = 6;

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatProgressSpinnerModule],
  template: `
    <div class="wrap">
      <mat-card class="card">
        <h1>Enter your code</h1>
        <p class="sub">We sent a 6-digit code to <strong>{{ email }}</strong></p>

        <div class="otp-boxes" (paste)="onPaste($event)">
          @for (i of boxIndexes; track i) {
            <input
              #box
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="1"
              class="otp-box"
              [value]="digits()[i]"
              (input)="onInput(i, $event)"
              (keydown)="onKeydown(i, $event)"
            />
          }
        </div>

        <mat-checkbox [formControl]="acceptedTerms" class="terms">
          I agree to Relish's Terms &amp; Conditions
        </mat-checkbox>

        @if (errorMsg()) {
          <p class="error">{{ errorMsg() }}</p>
        }

        <button
          mat-flat-button
          color="primary"
          class="submit"
          [disabled]="!codeComplete() || !acceptedTerms.value || loading()"
          (click)="submit()"
        >
          @if (loading()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            Verify
          }
        </button>

        <button mat-button class="back" (click)="backToRequest()">Use a different email</button>
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

    .otp-boxes {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .otp-box {
      width: 44px;
      height: 54px;
      border-radius: 10px;
      border: 1.5px solid var(--mat-sys-outline);
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      font-family: inherit;
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      /* hide the number spinner some mobile browsers add */
      -moz-appearance: textfield;
    }
    .otp-box::-webkit-outer-spin-button,
    .otp-box::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .otp-box:focus {
      border-color: var(--mat-sys-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mat-sys-primary) 20%, transparent);
    }

    .terms {
      font-size: 0.85rem;
      margin: 4px 0 4px;
    }
    .submit {
      margin-top: 8px;
      height: 44px;
    }
    .back {
      margin-top: 4px;
    }
    .error {
      color: var(--mat-sys-error);
      font-size: 0.85rem;
      margin: 0 0 4px;
    }
  `,
})
export class VerifyOtp {
  email: string;
  boxIndexes = Array.from({ length: BOX_COUNT }, (_, i) => i);
  digits = signal<string[]>(Array(BOX_COUNT).fill(''));
  codeComplete = computed(() => this.digits().every((d) => d !== ''));
  code = computed(() => this.digits().join(''));
  boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  acceptedTerms = new FormControl(false, { nonNullable: true });
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router,
    route: ActivatedRoute,
  ) {
    this.email = route.snapshot.queryParamMap.get('email') ?? '';
    if (!this.email) {
      this.router.navigate(['/auth']);
    }
  }

  onInput(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 1) {
      // fast typing / autofill can dump more than one char into a single box - treat like a paste
      this.distribute(value, index);
      return;
    }
    const next = [...this.digits()];
    next[index] = value.replace(/\D/g, '');
    this.digits.set(next);

    if (next[index] && index < BOX_COUNT - 1) {
      this.focusBox(index + 1);
    }
    this.maybeAutoSubmit();
  }

  onKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      event.preventDefault();
      const next = [...this.digits()];
      next[index - 1] = '';
      this.digits.set(next);
      this.focusBox(index - 1);
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.distribute(event.clipboardData?.getData('text') ?? '', 0);
  }

  private distribute(text: string, startIndex: number) {
    const clean = text.replace(/\D/g, '').slice(0, BOX_COUNT - startIndex);
    if (!clean) {
      return;
    }
    const next = [...this.digits()];
    for (let i = 0; i < clean.length; i++) {
      next[startIndex + i] = clean[i];
    }
    this.digits.set(next);

    const nextEmpty = next.findIndex((d, idx) => idx >= startIndex && !d);
    this.focusBox(nextEmpty === -1 ? Math.min(startIndex + clean.length, BOX_COUNT - 1) : nextEmpty);
    this.maybeAutoSubmit();
  }

  private maybeAutoSubmit() {
    if (this.codeComplete()) {
      this.submit();
    }
  }

  private focusBox(index: number) {
    const el = this.boxes()[index]?.nativeElement;
    el?.focus();
    el?.select();
  }

  async submit() {
    if (!this.codeComplete() || !this.acceptedTerms.value || this.loading()) {
      return;
    }
    this.loading.set(true);
    this.errorMsg.set(null);
    try {
      const user = await this.auth.verifyOtp(this.email, this.code(), this.acceptedTerms.value);
      this.router.navigate([ROLE_HOME[user.role] ?? '/customer']);
    } catch {
      this.errorMsg.set("That code didn't work, double check it or request a new one.");
      this.digits.set(Array(BOX_COUNT).fill(''));
      this.focusBox(0);
    } finally {
      this.loading.set(false);
    }
  }

  backToRequest() {
    this.router.navigate(['/auth']);
  }
}

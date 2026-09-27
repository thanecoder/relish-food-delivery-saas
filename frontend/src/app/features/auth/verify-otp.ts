import { Component, ElementRef, OnDestroy, computed, signal, viewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';
import { RegistrationFlowService } from '../../core/auth/registration-flow.service';
import { homeFor } from '../../core/auth/role-home';

const BOX_COUNT = 6;
const RESEND_COOLDOWN_SECONDS = 30;

@Component({
  selector: 'app-verify-otp',
  imports: [MatButtonModule, MatCardModule, MatProgressSpinnerModule],
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

        @if (errorMsg()) {
          <p class="error">{{ errorMsg() }}</p>
        }
        @if (noticeMsg()) {
          <p class="notice">{{ noticeMsg() }}</p>
        }

        <button
          mat-flat-button
          color="primary"
          class="submit"
          [disabled]="!codeComplete() || loading()"
          (click)="submit()"
        >
          @if (loading()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            Verify
          }
        </button>

        <button mat-button class="resend" [disabled]="cooldown() > 0 || resending()" (click)="resend()">
          @if (cooldown() > 0) {
            Resend code in {{ cooldown() }}s
          } @else if (resending()) {
            Sending...
          } @else {
            Didn't get it? Resend code
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

    .submit {
      margin-top: 8px;
      height: 44px;
    }
    .resend,
    .back {
      margin-top: 4px;
      font-size: 0.85rem;
    }
    .back {
      color: var(--mat-sys-on-surface-variant);
    }
    .error {
      color: var(--mat-sys-error);
      font-size: 0.85rem;
      margin: 0 0 4px;
    }
    .notice {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
      margin: 0 0 4px;
    }
  `,
})
export class VerifyOtp implements OnDestroy {
  email: string;
  boxIndexes = Array.from({ length: BOX_COUNT }, (_, i) => i);
  digits = signal<string[]>(Array(BOX_COUNT).fill(''));
  codeComplete = computed(() => this.digits().every((d) => d !== ''));
  code = computed(() => this.digits().join(''));
  boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  loading = signal(false);
  resending = signal(false);
  cooldown = signal(RESEND_COOLDOWN_SECONDS);
  errorMsg = signal<string | null>(null);
  noticeMsg = signal<string | null>(null);

  private ticker?: ReturnType<typeof setInterval>;

  constructor(
    private auth: AuthService,
    private registration: RegistrationFlowService,
    private router: Router,
    route: ActivatedRoute,
  ) {
    this.email = route.snapshot.queryParamMap.get('email') ?? '';
    if (!this.email) {
      this.router.navigate(['/auth']);
      return;
    }
    this.startCooldown(RESEND_COOLDOWN_SECONDS);
  }

  ngOnDestroy() {
    clearInterval(this.ticker);
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
    if (!this.codeComplete() || this.loading()) {
      return;
    }
    this.loading.set(true);
    this.errorMsg.set(null);
    this.noticeMsg.set(null);
    try {
      const outcome = await this.auth.verifyOtp(this.email, this.code());
      if (outcome.kind === 'session') {
        const user = outcome.user;
        this.router.navigate([user.status === 'ACTIVE' ? homeFor(user.role) : '/pending']);
      } else {
        // no account on this email yet - consent comes next, and only then does one get made
        this.registration.start(outcome.registrationToken, this.email, outcome.expiresIn);
        this.router.navigate(['/auth/terms']);
      }
    } catch (err: unknown) {
      const message = (err as { error?: { message?: string } })?.error?.message;
      this.errorMsg.set(message ?? "That code didn't work, double check it or request a new one.");
      this.digits.set(Array(BOX_COUNT).fill(''));
      this.focusBox(0);
      this.loading.set(false);
    }
  }

  resend() {
    if (this.cooldown() > 0 || this.resending()) {
      return;
    }
    this.resending.set(true);
    this.errorMsg.set(null);
    this.noticeMsg.set(null);
    this.auth.requestOtp(this.email).subscribe({
      next: () => {
        this.resending.set(false);
        this.noticeMsg.set('Sent a new code. The old one no longer works.');
        this.digits.set(Array(BOX_COUNT).fill(''));
        this.focusBox(0);
        this.startCooldown(RESEND_COOLDOWN_SECONDS);
      },
      error: (err) => {
        this.resending.set(false);
        // the server tells us how long its locked us out for, so wait that out rather than the usual 30s
        const retryAfter = Number(err?.headers?.get?.('Retry-After'));
        if (err?.status === 429) {
          this.errorMsg.set(err?.error?.message ?? 'Too many code requests, please wait a bit.');
          this.startCooldown(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60);
        } else {
          this.errorMsg.set('Could not send a new code, try again in a bit.');
        }
      },
    });
  }

  private startCooldown(seconds: number) {
    clearInterval(this.ticker);
    this.cooldown.set(seconds);
    this.ticker = setInterval(() => {
      const left = this.cooldown() - 1;
      this.cooldown.set(left);
      if (left <= 0) {
        clearInterval(this.ticker);
      }
    }, 1000);
  }

  backToRequest() {
    this.router.navigate(['/auth']);
  }
}

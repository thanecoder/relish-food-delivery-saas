import { Component, ElementRef, OnDestroy, computed, signal, viewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';
import { RegistrationFlowService } from '../../core/auth/registration-flow.service';
import { homeFor } from '../../core/auth/role-home';
import { AuthLayout } from './auth-layout';

const BOX_COUNT = 6;
const RESEND_COOLDOWN_SECONDS = 30;

@Component({
  selector: 'app-verify-otp',
  imports: [MatButtonModule, MatProgressSpinnerModule, AuthLayout],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.scss',
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

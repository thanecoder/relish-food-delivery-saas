import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';
import { RegistrationFlowService } from '../../core/auth/registration-flow.service';
import { homeFor } from '../../core/auth/role-home';
import { TermsContent } from './terms-content';

@Component({
  selector: 'app-accept-terms',
  imports: [MatButtonModule, MatProgressSpinnerModule, TermsContent],
  template: `
    <div class="page">
      <header class="head">
        <h1>Before we set up your account</h1>
        <p class="sub">
          Your email <strong>{{ email }}</strong> is confirmed. Have a read of our terms - your account gets
          created once you accept them.
        </p>
      </header>

      <div class="scroll">
        <app-terms-content></app-terms-content>
      </div>

      @if (errorMsg()) {
        <p class="error">{{ errorMsg() }}</p>
      }

      <footer class="actions">
        <button mat-button class="cancel" [disabled]="submitting()" (click)="cancel()">Cancel</button>
        <button mat-flat-button color="primary" class="accept" [disabled]="submitting()" (click)="accept()">
          @if (submitting()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            Accept &amp; create account
          }
        </button>
      </footer>
    </div>
  `,
  styles: `
    .page {
      max-width: 760px;
      margin: 0 auto;
      padding: 40px 20px 48px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    h1 {
      margin: 0 0 6px;
      font-size: 1.7rem;
    }
    .sub {
      margin: 0 0 20px;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.92rem;
    }
    .scroll {
      flex: 1;
      overflow-y: auto;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 14px;
      padding: 24px;
      background: var(--mat-sys-surface);
      max-height: 55vh;
    }
    .error {
      color: var(--mat-sys-error);
      font-size: 0.85rem;
      margin: 14px 0 0;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      margin-top: 22px;
    }
    .accept {
      height: 46px;
      padding: 0 22px;
    }
    .cancel {
      color: var(--mat-sys-on-surface-variant);
    }

    @media (max-width: 600px) {
      .actions {
        flex-direction: column-reverse;
        align-items: stretch;
      }
    }
  `,
})
export class AcceptTerms {
  email: string;
  submitting = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private registration: RegistrationFlowService,
    private router: Router,
  ) {
    this.email = this.registration.email() ?? '';
  }

  async accept() {
    const token = this.registration.token();
    if (!token || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    this.errorMsg.set(null);
    try {
      const user = await this.auth.register(token);
      this.registration.clear();
      this.router.navigate([homeFor(user.role)]);
    } catch (err: unknown) {
      const message = (err as { error?: { message?: string } })?.error?.message;
      this.errorMsg.set(message ?? 'Could not finish setting up your account, please try again.');
      this.submitting.set(false);
    }
  }

  // nothing was created, so theres no session to end here - just drop the token and go back
  cancel() {
    this.registration.clear();
    this.router.navigate(['/auth']);
  }
}

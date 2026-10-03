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
  templateUrl: './accept-terms.html',
  styleUrl: './accept-terms.scss',
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

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RegistrationFlowService } from './registration-flow.service';

// typing /auth/terms straight into the bar, or reloading it, means theres no token left to accept with
export const registrationGuard: CanActivateFn = () => {
  const registration = inject(RegistrationFlowService);
  const router = inject(Router);

  return registration.token() ? true : router.parseUrl('/auth');
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { homeFor } from './role-home';

/** Keeps anyone still waiting on approval out of their role area until theyre actually active. */
export const activeOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user()?.status === 'ACTIVE' ? true : router.parseUrl('/pending');
};

/** And the other way round, so an approved user doesnt get stuck looking at the waiting screen. */
export const pendingOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.user();
  return user?.status === 'ACTIVE' ? router.parseUrl(homeFor(user.role)) : true;
};

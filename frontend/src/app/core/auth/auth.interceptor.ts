import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// /me is the one auth endpoint that actually wants the bearer token. The rest either carry their
// own credential (the refresh cookie, a registration token in the body) or need none at all, and
// sending a stale access token to them just gets the request bounced by the resource server.
function needsBearer(url: string): boolean {
  return !url.includes('/api/v1/auth/') || url.includes('/api/v1/auth/me');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authedReq =
    token && needsBearer(req.url) ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !req.url.includes('/auth/')) {
        // access token probably expired, try one silent refresh then replay the request
        return from(auth.refresh()).pipe(
          switchMap(() => {
            const retried = req.clone({ setHeaders: { Authorization: `Bearer ${auth.getToken()}` } });
            return next(retried);
          }),
          catchError(() => throwError(() => err)),
        );
      }
      return throwError(() => err);
    }),
  );
};

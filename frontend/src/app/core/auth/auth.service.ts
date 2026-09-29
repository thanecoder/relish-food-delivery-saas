import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  status: string;
}

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

interface OtpVerifyResponse {
  outcome: 'SESSION' | 'REGISTRATION_REQUIRED';
  session: AuthResponse | null;
  registrationToken: string | null;
  expiresIn: number;
}

export type VerifyOutcome =
  | { kind: 'session'; user: AuthUser }
  | { kind: 'registrationRequired'; registrationToken: string; expiresIn: number };

export interface AccountProfile {
  email: string;
  name: string;
  role: string;
  status: string;
  memberSince: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessToken = signal<string | null>(null);
  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => !!this.accessToken());

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return this.accessToken();
  }

  requestOtp(email: string) {
    return this.http.post<void>('/api/v1/auth/otp/request', { email });
  }

  async verifyOtp(email: string, code: string): Promise<VerifyOutcome> {
    const res = await firstValueFrom(
      this.http.post<OtpVerifyResponse>('/api/v1/auth/otp/verify', { email, code }),
    );
    if (res.outcome === 'SESSION' && res.session) {
      return { kind: 'session', user: this.applySession(res.session) };
    }
    return {
      kind: 'registrationRequired',
      registrationToken: res.registrationToken!,
      expiresIn: res.expiresIn,
    };
  }

  async register(registrationToken: string): Promise<AuthUser> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>('/api/v1/auth/register', { registrationToken, acceptedTerms: true }),
    );
    return this.applySession(res);
  }

  async refresh(): Promise<AuthUser> {
    const res = await firstValueFrom(this.http.post<AuthResponse>('/api/v1/auth/refresh', {}));
    return this.applySession(res);
  }

  /**
   * The access token only lives in memory, so a reload starts with nothing. The refresh cookie
   * usually outlives it by days - this gives it one chance to hand the session back.
   */
  async restoreSession(): Promise<void> {
    try {
      await this.refresh();
    } catch {
      // no cookie, or its past it. Either way theyre just logged out.
    }
  }

  async logout() {
    try {
      await firstValueFrom(this.http.post('/api/v1/auth/logout', {}));
    } finally {
      this.accessToken.set(null);
      this.user.set(null);
    }
  }

  getAccount() {
    return this.http.get<AccountProfile>('/api/v1/account');
  }

  /** Wipes the account server-side, then clears out the local session exactly like a logout would. */
  async deleteAccount(): Promise<void> {
    await firstValueFrom(this.http.delete<void>('/api/v1/account'));
    await this.logout();
  }

  private applySession(res: AuthResponse): AuthUser {
    this.accessToken.set(res.accessToken);
    const user = { email: res.email, name: res.name, role: res.role, status: res.status };
    this.user.set(user);
    return user;
  }
}

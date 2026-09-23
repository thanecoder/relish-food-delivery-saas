import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  email: string;
  name: string;
  role: string;
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

  async verifyOtp(email: string, code: string, acceptedTerms: boolean): Promise<AuthUser> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>('/api/v1/auth/otp/verify', { email, code, acceptedTerms }),
    );
    return this.applySession(res);
  }

  async refresh(): Promise<AuthUser> {
    const res = await firstValueFrom(this.http.post<AuthResponse>('/api/v1/auth/refresh', {}));
    return this.applySession(res);
  }

  async logout() {
    await firstValueFrom(this.http.post('/api/v1/auth/logout', {}));
    this.accessToken.set(null);
    this.user.set(null);
  }

  private applySession(res: AuthResponse): AuthUser {
    this.accessToken.set(res.accessToken);
    const user = { email: res.email, name: res.name, role: res.role };
    this.user.set(user);
    return user;
  }
}

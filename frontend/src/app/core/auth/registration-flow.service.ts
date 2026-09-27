import { Injectable, signal } from '@angular/core';

interface PendingRegistration {
  token: string;
  email: string;
  expiresAt: number;
}

/**
 * Holds the short lived token between "your code was right" and "yes, I accept the terms". Kept
 * away from AuthService on purpose - theres no session here, and nothing should mistake it for one.
 * In memory only, so a reload or a cancel drops it without any cleanup.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationFlowService {
  private pending = signal<PendingRegistration | null>(null);

  start(token: string, email: string, expiresInSeconds: number) {
    this.pending.set({ token, email, expiresAt: Date.now() + expiresInSeconds * 1000 });
  }

  clear() {
    this.pending.set(null);
  }

  email(): string | null {
    return this.current()?.email ?? null;
  }

  token(): string | null {
    return this.current()?.token ?? null;
  }

  private current(): PendingRegistration | null {
    const value = this.pending();
    if (!value) {
      return null;
    }
    if (Date.now() >= value.expiresAt) {
      this.pending.set(null);
      return null;
    }
    return value;
  }
}

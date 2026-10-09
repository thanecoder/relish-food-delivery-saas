import { ErrorHandler, Injectable, effect, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  EventEvent,
  ExceptionEvent,
  Faro,
  LogLevel,
  TransportItem,
  TransportItemType,
  getWebInstrumentations,
  initializeFaro,
} from '@grafana/faro-web-sdk';
import { AuthService } from '../auth/auth.service';

declare global {
  interface Window {
    __RELISH__?: { faroUrl?: string; environment?: string };
  }
}

let faro: Faro | null = null;

// the verify page keeps the email in its query string and order pages have the order id in the path,
// neither should end up in the monitoring data
function cleanUrl(url: string): string {
  return url
    .split('?')[0]
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ':id');
}

// page load and resource timing events keep the full url in their name, outside the page meta
function cleanEventName(item: TransportItem): TransportItem {
  if (item.type !== TransportItemType.EVENT) return item;
  const event = item.payload as EventEvent;
  const name = event.attributes?.['name'];
  if (!name?.startsWith('http')) return item;
  return { ...item, payload: { ...event, attributes: { ...event.attributes, name: cleanUrl(name) } } };
}

let lastException = { key: '', at: 0 };

// a window error reaches both angular's global listener and faro's own, so the same one comes in twice
function isRepeat(item: TransportItem): boolean {
  if (item.type !== TransportItemType.EXCEPTION) return false;
  const { type, value } = item.payload as ExceptionEvent;
  const key = `${type}:${value}`;
  const repeat = key === lastException.key && Date.now() - lastException.at < 1000;
  lastException = { key, at: Date.now() };
  return repeat;
}

export function startMonitoring(): void {
  const config = window.__RELISH__;
  if (!config?.faroUrl) return;

  faro = initializeFaro({
    url: config.faroUrl,
    app: { name: 'relish-frontend', environment: config.environment || 'local' },
    instrumentations: [...getWebInstrumentations()],
    // console.error is left out, angular's error handler already reports those with a proper stack
    consoleInstrumentation: {
      disabledLevels: [LogLevel.DEBUG, LogLevel.TRACE, LogLevel.LOG, LogLevel.ERROR],
    },
    beforeSend: (item) => {
      if (isRepeat(item)) return null;
      const clean = cleanEventName(item);
      const page = clean.meta.page;
      if (!page?.url) return clean;
      return { ...clean, meta: { ...clean.meta, page: { ...page, url: cleanUrl(page.url) } } };
    },
  });
}

@Injectable()
export class MonitoringErrorHandler extends ErrorHandler {
  override handleError(error: unknown): void {
    faro?.api.pushError(error instanceof Error ? error : new Error(String(error)));
    super.handleError(error);
  }
}

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) faro?.api.setView({ name: cleanUrl(event.urlAfterRedirects) });
    });

    // only the role goes along, no id, email or name
    effect(() => {
      const role = this.auth.user()?.role;
      if (role) faro?.api.setUser({ attributes: { role } });
      else faro?.api.resetUser();
    });
  }
}

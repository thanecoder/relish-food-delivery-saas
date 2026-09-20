import { Routes } from '@angular/router';

// Route guards (role-aware, per docs/architecture-and-roles.md §6) are wired in M4 alongside
// the OTP auth flow. Each feature area is its own lazy-loaded chunk so, e.g., a customer's
// bundle never pulls in the platform-admin screens.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/request-otp').then((m) => m.RequestOtp),
  },
  {
    path: 'customer',
    loadComponent: () => import('./features/customer/customer-home').then((m) => m.CustomerHome),
  },
  {
    path: 'restaurant-admin',
    loadComponent: () =>
      import('./features/restaurant-admin/restaurant-admin-home').then((m) => m.RestaurantAdminHome),
  },
  {
    path: 'delivery',
    loadComponent: () => import('./features/delivery/delivery-home').then((m) => m.DeliveryHome),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/platform-admin/platform-admin-home').then((m) => m.PlatformAdminHome),
  },
];

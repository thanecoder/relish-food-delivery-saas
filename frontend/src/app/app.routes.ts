import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

// each area lazy loads on its own so customers dont end up downloading the admin screens etc
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/request-otp').then((m) => m.RequestOtp),
  },
  {
    path: 'auth/verify',
    loadComponent: () => import('./features/auth/verify-otp').then((m) => m.VerifyOtp),
  },
  {
    path: 'customer',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customer/restaurant-list').then((m) => m.RestaurantList),
  },
  {
    path: 'customer/restaurants/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customer/restaurant-detail').then((m) => m.RestaurantDetail),
  },
  {
    path: 'customer/checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customer/checkout').then((m) => m.Checkout),
  },
  {
    path: 'customer/orders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customer/order-history').then((m) => m.OrderHistory),
  },
  {
    path: 'customer/orders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customer/order-detail').then((m) => m.OrderDetail),
  },
  {
    path: 'restaurant-admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/restaurant-admin/restaurant-admin-home').then((m) => m.RestaurantAdminHome),
  },
  {
    path: 'delivery',
    canActivate: [authGuard],
    loadComponent: () => import('./features/delivery/delivery-home').then((m) => m.DeliveryHome),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/platform-admin/platform-admin-home').then((m) => m.PlatformAdminHome),
  },
];

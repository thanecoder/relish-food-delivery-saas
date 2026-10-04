import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { registrationGuard } from './core/auth/registration.guard';
import { activeOnlyGuard, pendingOnlyGuard } from './core/auth/status.guard';

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
    path: 'auth/terms',
    canActivate: [registrationGuard],
    loadComponent: () => import('./features/auth/accept-terms').then((m) => m.AcceptTerms),
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/legal/terms-page').then((m) => m.TermsPage),
  },
  {
    path: 'pending',
    canActivate: [authGuard, pendingOnlyGuard],
    loadComponent: () => import('./features/auth/pending-review').then((m) => m.PendingReview),
  },
  {
    path: 'customer',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () => import('./features/customer/restaurant-list').then((m) => m.RestaurantList),
  },
  {
    path: 'customer/restaurants/:id',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () => import('./features/customer/restaurant-detail').then((m) => m.RestaurantDetail),
  },
  {
    path: 'customer/checkout',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () => import('./features/customer/checkout').then((m) => m.Checkout),
  },
  {
    path: 'customer/orders',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () => import('./features/customer/order-history').then((m) => m.OrderHistory),
  },
  {
    path: 'customer/orders/:id',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () => import('./features/customer/order-detail').then((m) => m.OrderDetail),
  },
  {
    path: 'customer/account',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () => import('./features/customer/account').then((m) => m.Account),
  },
  {
    path: 'restaurant-admin',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () =>
      import('./features/restaurant-admin/restaurant-admin-home').then((m) => m.RestaurantAdminHome),
  },
  {
    path: 'restaurant-admin/orders',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () =>
      import('./features/restaurant-admin/restaurant-admin-orders').then((m) => m.RestaurantAdminOrders),
  },
  {
    path: 'restaurant-admin/account',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () =>
      import('./features/restaurant-admin/restaurant-admin-account').then((m) => m.RestaurantAdminAccount),
  },
  {
    path: 'delivery',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () => import('./features/delivery/delivery-home').then((m) => m.DeliveryHome),
  },
  {
    path: 'admin',
    canActivate: [authGuard, activeOnlyGuard],
    loadComponent: () =>
      import('./features/platform-admin/platform-admin-home').then((m) => m.PlatformAdminHome),
  },
];

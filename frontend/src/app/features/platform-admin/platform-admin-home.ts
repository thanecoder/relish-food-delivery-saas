import { Component, OnInit, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Avatar } from '../../core/ui/avatar';
import { AdminRestaurant, AdminUser, PlatformAdminApiService } from './platform-admin-api.service';
import { PlatformAdminHeader } from './platform-admin-header';

const ROLE_LABEL: Record<string, string> = {
  RESTAURANT_ADMIN: 'Restaurant owner',
  DELIVERY_PARTNER: 'Delivery partner',
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Waiting',
  APPROVED: 'Approved',
  ACTIVE: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

type Tab = 'restaurants' | 'accounts';

@Component({
  selector: 'app-platform-admin-home',
  imports: [MatButtonModule, MatProgressSpinnerModule, Avatar, PlatformAdminHeader],
  templateUrl: './platform-admin-home.html',
  styleUrl: './platform-admin-home.scss',
})
export class PlatformAdminHome implements OnInit {
  restaurants = signal<AdminRestaurant[]>([]);
  users = signal<AdminUser[]>([]);
  loading = signal(true);
  busy = signal<string | null>(null);
  tab = signal<Tab>('restaurants');

  pendingRestaurants = computed(() => this.restaurants().filter((r) => r.status === 'PENDING'));
  approvedRestaurants = computed(() => this.restaurants().filter((r) => r.status === 'APPROVED'));
  closedRestaurants = computed(() =>
    this.restaurants().filter((r) => r.status === 'REJECTED' || r.status === 'SUSPENDED'),
  );

  pendingUsers = computed(() => this.users().filter((u) => u.status === 'PENDING'));
  approvedUsers = computed(() => this.users().filter((u) => u.status === 'ACTIVE'));
  closedUsers = computed(() => this.users().filter((u) => u.status === 'REJECTED' || u.status === 'SUSPENDED'));

  constructor(private api: PlatformAdminApiService) {}

  ngOnInit() {
    this.api.getRestaurants().subscribe((list) => this.restaurants.set(list));
    this.api.getUsers().subscribe({
      next: (list) => {
        this.users.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  roleLabel(role: string) {
    return ROLE_LABEL[role] ?? role;
  }

  statusLabel(status: string) {
    return STATUS_LABEL[status] ?? status;
  }

  approveRestaurant(r: AdminRestaurant) {
    this.busy.set(r.id);
    this.api.approveRestaurant(r.id).subscribe({
      next: (updated) => this.replaceRestaurant(updated),
      error: () => this.busy.set(null),
    });
  }

  rejectRestaurant(r: AdminRestaurant) {
    this.busy.set(r.id);
    this.api.rejectRestaurant(r.id).subscribe({
      next: (updated) => this.replaceRestaurant(updated),
      error: () => this.busy.set(null),
    });
  }

  approveUser(u: AdminUser) {
    this.busy.set(u.id);
    this.api.approveUser(u.id).subscribe({
      next: (updated) => this.replaceUser(updated),
      error: () => this.busy.set(null),
    });
  }

  rejectUser(u: AdminUser) {
    this.busy.set(u.id);
    this.api.rejectUser(u.id).subscribe({
      next: (updated) => this.replaceUser(updated),
      error: () => this.busy.set(null),
    });
  }

  private replaceRestaurant(updated: AdminRestaurant) {
    this.restaurants.set(this.restaurants().map((r) => (r.id === updated.id ? updated : r)));
    this.busy.set(null);
  }

  private replaceUser(updated: AdminUser) {
    this.users.set(this.users().map((u) => (u.id === updated.id ? updated : u)));
    this.busy.set(null);
  }
}

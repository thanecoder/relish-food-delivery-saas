import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PendingRestaurant, PendingUser, PlatformAdminApiService } from './platform-admin-api.service';
import { PlatformAdminHeader } from './platform-admin-header';

@Component({
  selector: 'app-platform-admin-home',
  imports: [MatButtonModule, MatProgressSpinnerModule, PlatformAdminHeader],
  templateUrl: './platform-admin-home.html',
  styleUrl: './platform-admin-home.scss',
})
export class PlatformAdminHome implements OnInit {
  restaurants = signal<PendingRestaurant[]>([]);
  users = signal<PendingUser[]>([]);
  loading = signal(true);
  approving = signal<string | null>(null);

  constructor(private api: PlatformAdminApiService) {}

  ngOnInit() {
    this.api.getPendingRestaurants().subscribe({
      next: (list) => this.restaurants.set(list),
      error: () => {},
    });
    this.api.getPendingUsers().subscribe({
      next: (list) => {
        this.users.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  approveRestaurant(r: PendingRestaurant) {
    this.approving.set(r.id);
    this.api.approveRestaurant(r.id).subscribe({
      next: () => {
        this.restaurants.set(this.restaurants().filter((x) => x.id !== r.id));
        this.approving.set(null);
      },
      error: () => this.approving.set(null),
    });
  }

  approveUser(u: PendingUser) {
    this.approving.set(u.id);
    this.api.approveUser(u.id).subscribe({
      next: () => {
        this.users.set(this.users().filter((x) => x.id !== u.id));
        this.approving.set(null);
      },
      error: () => this.approving.set(null),
    });
  }
}

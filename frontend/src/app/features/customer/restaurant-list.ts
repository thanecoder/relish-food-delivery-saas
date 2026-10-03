import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerApiService, Restaurant } from './customer-api.service';
import { CustomerHeader } from './customer-header';

@Component({
  selector: 'app-restaurant-list',
  imports: [MatIconModule, MatProgressSpinnerModule, CustomerHeader],
  templateUrl: './restaurant-list.html',
  styleUrl: './restaurant-list.scss',
})
export class RestaurantList implements OnInit {
  restaurants = signal<Restaurant[]>([]);
  loading = signal(true);

  // rotate a couple of theme-adjacent colors for the banner so the grid isnt all one flat block
  private readonly bannerColors = ['var(--mat-sys-primary)', 'var(--mat-sys-tertiary)', '#8A5A44'];

  constructor(
    private api: CustomerApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.api.listRestaurants().subscribe({
      next: (list) => {
        this.restaurants.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  bannerColor(id: string) {
    let hash = 0;
    for (const ch of id) {
      hash = (hash + ch.charCodeAt(0)) % this.bannerColors.length;
    }
    return this.bannerColors[hash];
  }

  open(r: Restaurant) {
    this.router.navigate(['/customer/restaurants', r.id]);
  }
}

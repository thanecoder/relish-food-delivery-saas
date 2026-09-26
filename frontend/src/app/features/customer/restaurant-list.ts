import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerApiService, Restaurant } from './customer-api.service';
import { CustomerHeader } from './customer-header';

@Component({
  selector: 'app-restaurant-list',
  imports: [MatIconModule, MatProgressSpinnerModule, CustomerHeader],
  template: `
    <app-customer-header></app-customer-header>

    <div class="hero">
      <div class="hero-inner">
        <h1>What are you craving?</h1>
        <p>Order from the restaurants on Relish, delivered to your door.</p>
      </div>
    </div>

    <div class="page">
      <div class="section-head">
        <h2>Restaurants near you</h2>
        @if (!loading()) {
          <span class="count">{{ restaurants().length }} open now</span>
        }
      </div>

      @if (loading()) {
        <div class="center">
          <mat-spinner diameter="32"></mat-spinner>
        </div>
      } @else if (restaurants().length === 0) {
        <p class="empty">No restaurants are open right now, check back soon.</p>
      } @else {
        <div class="grid">
          @for (r of restaurants(); track r.id) {
            <button class="tile" (click)="open(r)">
              <div class="banner" [style.background]="bannerColor(r.id)">
                <mat-icon>restaurant</mat-icon>
              </div>
              <div class="body">
                <div class="name">{{ r.name }}</div>
                <div class="tags">{{ r.cuisineTags }}</div>
                <div class="loc">
                  <mat-icon class="pin">place</mat-icon>{{ r.city }}
                </div>
              </div>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .hero {
      background: linear-gradient(120deg, var(--mat-sys-primary), var(--mat-sys-tertiary));
      color: white;
      padding: 56px 20px;
    }
    .hero-inner {
      max-width: 1180px;
      margin: 0 auto;
    }
    .hero h1 {
      margin: 0 0 8px;
      font-size: 2.1rem;
    }
    .hero p {
      margin: 0;
      opacity: 0.92;
      font-size: 1.02rem;
    }
    .page {
      max-width: 1180px;
      margin: 0 auto;
      padding: 32px 20px 60px;
    }
    .section-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .section-head h2 {
      margin: 0;
      font-size: 1.3rem;
    }
    .count {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
    }
    .center {
      display: flex;
      justify-content: center;
      padding: 60px 0;
    }
    .empty {
      color: var(--mat-sys-on-surface-variant);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }
    .tile {
      text-align: left;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 16px;
      overflow: hidden;
      background: var(--mat-sys-surface);
      cursor: pointer;
      padding: 0;
      font-family: inherit;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
    }
    .tile:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
    }
    .banner {
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .banner mat-icon {
      font-size: 38px;
      width: 38px;
      height: 38px;
      opacity: 0.9;
    }
    .body {
      padding: 14px 16px 18px;
    }
    .name {
      font-weight: 700;
      font-size: 1.08rem;
      margin-bottom: 2px;
    }
    .tags {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
      margin-bottom: 8px;
    }
    .loc {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .pin {
      font-size: 15px;
      width: 15px;
      height: 15px;
      margin-right: 3px;
    }
  `,
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

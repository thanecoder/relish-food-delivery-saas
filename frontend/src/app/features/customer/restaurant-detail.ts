import { DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerApiService, MenuCategory, MenuItem, Restaurant } from './customer-api.service';
import { CartService } from './cart.service';
import { CustomerHeader } from './customer-header';

@Component({
  selector: 'app-restaurant-detail',
  imports: [DecimalPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CustomerHeader],
  templateUrl: './restaurant-detail.html',
  styleUrl: './restaurant-detail.scss',
})
export class RestaurantDetail implements OnInit {
  restaurant = signal<Restaurant | null>(null);
  categories = signal<MenuCategory[]>([]);
  loading = signal(true);
  private restaurantId!: string;

  constructor(
    private api: CustomerApiService,
    protected cart: CartService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.restaurantId = this.route.snapshot.paramMap.get('id')!;
    this.api.getRestaurant(this.restaurantId).subscribe((r) => this.restaurant.set(r));
    this.api.getMenu(this.restaurantId).subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  qtyInCart(itemId: string) {
    return this.cart.lines().find((l) => l.item.id === itemId)?.quantity ?? 0;
  }

  add(item: MenuItem) {
    this.cart.add(this.restaurantId, this.restaurant()?.name ?? '', item);
  }

  dec(item: MenuItem) {
    this.cart.setQuantity(item.id, this.qtyInCart(item.id) - 1);
  }

  goToCheckout() {
    this.router.navigate(['/customer/checkout']);
  }

  back() {
    this.router.navigate(['/customer']);
  }
}

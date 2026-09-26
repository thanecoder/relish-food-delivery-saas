import { Injectable, computed, signal } from '@angular/core';
import { MenuItem } from './customer-api.service';

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  restaurantId = signal<string | null>(null);
  restaurantName = signal<string | null>(null);
  lines = signal<CartLine[]>([]);

  itemCount = computed(() => this.lines().reduce((sum, l) => sum + l.quantity, 0));
  subtotal = computed(() => this.lines().reduce((sum, l) => sum + l.item.price * l.quantity, 0));

  add(restaurantId: string, restaurantName: string, item: MenuItem) {
    // one restaurant per cart - starting a new one just replaces whatever was there
    if (this.restaurantId() !== restaurantId) {
      this.restaurantId.set(restaurantId);
      this.restaurantName.set(restaurantName);
      this.lines.set([]);
    }
    const existing = this.lines().find((l) => l.item.id === item.id);
    if (existing) {
      this.setQuantity(item.id, existing.quantity + 1);
    } else {
      this.lines.set([...this.lines(), { item, quantity: 1 }]);
    }
  }

  setQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.lines.set(this.lines().filter((l) => l.item.id !== itemId));
      return;
    }
    this.lines.set(this.lines().map((l) => (l.item.id === itemId ? { ...l, quantity } : l)));
  }

  clear() {
    this.restaurantId.set(null);
    this.restaurantName.set(null);
    this.lines.set([]);
  }
}

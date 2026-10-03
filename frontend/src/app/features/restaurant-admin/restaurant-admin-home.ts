import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MenuCategory, MenuItem, MyRestaurant, RestaurantAdminApiService } from './restaurant-admin-api.service';
import { RestaurantAdminHeader } from './restaurant-admin-header';

@Component({
  selector: 'app-restaurant-admin-home',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RestaurantAdminHeader,
  ],
  templateUrl: './restaurant-admin-home.html',
  styleUrl: './restaurant-admin-home.scss',
})
export class RestaurantAdminHome implements OnInit {
  restaurant = signal<MyRestaurant | null>(null);
  categories = signal<MenuCategory[]>([]);
  loading = signal(true);
  saving = signal(false);

  addingCategory = signal(false);
  addingItemFor = signal<string | null>(null);
  editingItem = signal<string | null>(null);

  private fb = inject(FormBuilder);
  categoryForm = this.fb.group({ name: ['', Validators.required] });
  itemForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    isVeg: [false],
  });

  constructor(private api: RestaurantAdminApiService) {}

  ngOnInit() {
    this.api.getMyRestaurant().subscribe((r) => this.restaurant.set(r));
    this.api.getMyMenu().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveNewCategory() {
    if (this.categoryForm.invalid) {
      return;
    }
    this.saving.set(true);
    this.api.addCategory({ name: this.categoryForm.value.name!, sortOrder: this.categories().length }).subscribe({
      next: (category) => {
        this.categories.set([...this.categories(), category]);
        this.categoryForm.reset();
        this.addingCategory.set(false);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  startAddItem(categoryId: string) {
    this.editingItem.set(null);
    this.itemForm.reset({ name: '', description: '', price: 0, isVeg: false });
    this.addingItemFor.set(categoryId);
  }

  saveNewItem(categoryId: string) {
    if (this.itemForm.invalid) {
      return;
    }
    this.saving.set(true);
    const value = this.itemForm.getRawValue();
    this.api
      .addItem({
        categoryId,
        name: value.name!,
        description: value.description ?? '',
        price: value.price!,
        isVeg: value.isVeg!,
      })
      .subscribe({
        next: (item) => {
          this.categories.set(
            this.categories().map((c) => (c.id === categoryId ? { ...c, items: [...c.items, item] } : c)),
          );
          this.addingItemFor.set(null);
          this.saving.set(false);
        },
        error: () => this.saving.set(false),
      });
  }

  startEditItem(item: MenuItem) {
    this.addingItemFor.set(null);
    this.itemForm.reset({
      name: item.name,
      description: item.description ?? '',
      price: item.price,
      isVeg: item.isVeg,
    });
    this.editingItem.set(item.id);
  }

  saveItemEdit(itemId: string) {
    if (this.itemForm.invalid) {
      return;
    }
    this.saving.set(true);
    const value = this.itemForm.getRawValue();
    this.api
      .updateItem(itemId, {
        name: value.name!,
        description: value.description ?? '',
        price: value.price!,
        isVeg: value.isVeg!,
      })
      .subscribe({
        next: (updated) => {
          this.categories.set(
            this.categories().map((c) => ({
              ...c,
              items: c.items.map((i) => (i.id === itemId ? updated : i)),
            })),
          );
          this.editingItem.set(null);
          this.saving.set(false);
        },
        error: () => this.saving.set(false),
      });
  }

  cancelItemEdit() {
    this.addingItemFor.set(null);
    this.editingItem.set(null);
  }

  toggleAvailability(item: MenuItem) {
    this.api.setAvailability(item.id, !item.isAvailable).subscribe((updated) => {
      this.categories.set(
        this.categories().map((c) => ({
          ...c,
          items: c.items.map((i) => (i.id === item.id ? updated : i)),
        })),
      );
    });
  }
}

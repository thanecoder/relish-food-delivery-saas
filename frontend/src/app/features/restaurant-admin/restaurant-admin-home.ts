import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../core/auth/auth.service';
import { MenuCategory, MenuItem, MyRestaurant, RestaurantAdminApiService } from './restaurant-admin-api.service';

@Component({
  selector: 'app-restaurant-admin-home',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
  template: `
    <header class="bar">
      <div class="brand">Relish <span class="for">for restaurants</span></div>
      <div class="spacer"></div>
      <button mat-button (click)="logout()">Log out</button>
    </header>

    @if (loading()) {
      <div class="center">
        <mat-spinner diameter="32"></mat-spinner>
      </div>
    } @else if (restaurant()) {
      <div class="page">
        <div class="rest-head">
          <h1>{{ restaurant()!.name }}</h1>
          <span class="status" [class]="'s-' + restaurant()!.status.toLowerCase()">{{ restaurant()!.status }}</span>
        </div>
        <p class="sub">{{ restaurant()!.cuisineTags }} &middot; {{ restaurant()!.addressLine }}, {{ restaurant()!.city }}</p>

        @for (cat of categories(); track cat.id) {
          <section class="cat">
            <div class="cat-head">
              <h2>{{ cat.name }}</h2>
              <button mat-button (click)="startAddItem(cat.id)">
                <mat-icon>add</mat-icon> Add item
              </button>
            </div>

            @for (item of cat.items; track item.id) {
              @if (editingItem() === item.id) {
                <form class="item-form" [formGroup]="itemForm" (ngSubmit)="saveItemEdit(item.id)">
                  <input formControlName="name" placeholder="Name" />
                  <input formControlName="description" placeholder="Description" />
                  <input formControlName="price" type="number" step="0.01" placeholder="Price" />
                  <label class="veg-check">
                    <input type="checkbox" formControlName="isVeg" /> Vegetarian
                  </label>
                  <div class="form-actions">
                    <button type="button" mat-button (click)="cancelItemEdit()">Cancel</button>
                    <button type="submit" mat-flat-button color="primary" [disabled]="itemForm.invalid || saving()">
                      Save
                    </button>
                  </div>
                </form>
              } @else {
                <div class="item" [class.unavailable]="!item.isAvailable">
                  <div class="info">
                    <div class="name">
                      {{ item.name }}
                      @if (item.isVeg) {
                        <span class="veg" title="Vegetarian"></span>
                      }
                    </div>
                    @if (item.description) {
                      <div class="idesc">{{ item.description }}</div>
                    }
                    <div class="price">&#8377;{{ item.price | number: '1.2-2' }}</div>
                  </div>
                  <div class="actions">
                    <mat-slide-toggle
                      [checked]="item.isAvailable"
                      (change)="toggleAvailability(item)"
                    ></mat-slide-toggle>
                    <button mat-icon-button (click)="startEditItem(item)" aria-label="Edit item">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </div>
                </div>
              }
            }

            @if (addingItemFor() === cat.id) {
              <form class="item-form" [formGroup]="itemForm" (ngSubmit)="saveNewItem(cat.id)">
                <input formControlName="name" placeholder="Name" />
                <input formControlName="description" placeholder="Description" />
                <input formControlName="price" type="number" step="0.01" placeholder="Price" />
                <label class="veg-check">
                  <input type="checkbox" formControlName="isVeg" /> Vegetarian
                </label>
                <div class="form-actions">
                  <button type="button" mat-button (click)="cancelItemEdit()">Cancel</button>
                  <button type="submit" mat-flat-button color="primary" [disabled]="itemForm.invalid || saving()">
                    Add item
                  </button>
                </div>
              </form>
            }
          </section>
        }

        @if (!addingCategory()) {
          <button mat-stroked-button class="add-cat" (click)="addingCategory.set(true)">
            <mat-icon>add</mat-icon> Add category
          </button>
        } @else {
          <form class="cat-form" [formGroup]="categoryForm" (ngSubmit)="saveNewCategory()">
            <input formControlName="name" placeholder="Category name (e.g. Desserts)" />
            <div class="form-actions">
              <button type="button" mat-button (click)="addingCategory.set(false)">Cancel</button>
              <button type="submit" mat-flat-button color="primary" [disabled]="categoryForm.invalid || saving()">
                Add category
              </button>
            </div>
          </form>
        }
      </div>
    }
  `,
  styles: `
    .bar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface);
    }
    .brand {
      font-weight: 800;
      font-size: 1.25rem;
      color: var(--mat-sys-primary);
    }
    .brand .for {
      font-weight: 500;
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .spacer {
      flex: 1;
    }
    .center {
      display: flex;
      justify-content: center;
      padding: 60px 0;
    }
    .page {
      max-width: 720px;
      margin: 0 auto;
      padding: 28px 20px 60px;
    }
    .rest-head {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    h1 {
      margin: 0;
      font-size: 1.6rem;
    }
    .status {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 3px 9px;
      border-radius: 20px;
      background: var(--mat-sys-surface-variant);
      color: var(--mat-sys-on-surface-variant);
    }
    .status.s-approved {
      background: color-mix(in srgb, #2e7d32 18%, transparent);
      color: #2e7d32;
    }
    .status.s-pending {
      background: color-mix(in srgb, var(--mat-sys-tertiary) 25%, transparent);
      color: var(--mat-sys-tertiary);
    }
    .status.s-suspended {
      background: color-mix(in srgb, var(--mat-sys-error) 18%, transparent);
      color: var(--mat-sys-error);
    }
    .sub {
      margin: 4px 0 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }
    .cat {
      margin-top: 30px;
    }
    .cat-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      padding-bottom: 6px;
      margin-bottom: 4px;
    }
    .cat-head h2 {
      font-size: 1.05rem;
      margin: 0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .item.unavailable {
      opacity: 0.55;
    }
    .name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .veg {
      width: 10px;
      height: 10px;
      border: 1.5px solid #2e7d32;
      border-radius: 2px;
      display: inline-block;
      position: relative;
    }
    .veg::after {
      content: '';
      position: absolute;
      inset: 1.5px;
      background: #2e7d32;
      border-radius: 50%;
    }
    .idesc {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.8rem;
      margin: 2px 0 6px;
    }
    .price {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    .item-form,
    .cat-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 14px 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .item-form input,
    .cat-form input {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1.5px solid var(--mat-sys-outline);
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      font-family: inherit;
      font-size: 0.9rem;
    }
    .veg-check {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .add-cat {
      margin-top: 26px;
    }
  `,
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

  constructor(
    private api: RestaurantAdminApiService,
    private auth: AuthService,
    private router: Router,
  ) {}

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

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth']);
  }
}

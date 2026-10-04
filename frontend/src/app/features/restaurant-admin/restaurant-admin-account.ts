import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountProfile, AuthService } from '../../core/auth/auth.service';
import { Avatar } from '../../core/ui/avatar';
import { MyRestaurant, RestaurantAdminApiService } from './restaurant-admin-api.service';
import { RestaurantAdminHeader } from './restaurant-admin-header';

@Component({
  selector: 'app-restaurant-admin-account',
  imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatProgressSpinnerModule, Avatar, RestaurantAdminHeader],
  templateUrl: './restaurant-admin-account.html',
  styleUrl: './restaurant-admin-account.scss',
})
export class RestaurantAdminAccount implements OnInit {
  profile = signal<AccountProfile | null>(null);
  loading = signal(true);
  saving = signal(false);
  savedMsg = signal<string | null>(null);
  errorMsg = signal<string | null>(null);

  confirming = signal(false);
  deleting = signal(false);
  deleteErrorMsg = signal<string | null>(null);

  private fb = inject(FormBuilder);
  profileForm = this.fb.group({
    addressLine: ['', Validators.required],
    city: ['', Validators.required],
    opensAt: ['', Validators.required],
    closesAt: ['', Validators.required],
  });

  constructor(
    private auth: AuthService,
    private restaurantApi: RestaurantAdminApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.auth.getAccount().subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => {},
    });
    this.restaurantApi.getMyRestaurant().subscribe({
      next: (restaurant) => {
        this.profileForm.patchValue({
          addressLine: restaurant.addressLine,
          city: restaurant.city,
          opensAt: toTimeInputValue(restaurant.opensAt),
          closesAt: toTimeInputValue(restaurant.closesAt),
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      return;
    }
    this.saving.set(true);
    this.savedMsg.set(null);
    this.errorMsg.set(null);
    const value = this.profileForm.getRawValue();
    this.restaurantApi
      .updateMyRestaurant({
        addressLine: value.addressLine!,
        city: value.city!,
        opensAt: value.opensAt!,
        closesAt: value.closesAt!,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.savedMsg.set('Saved.');
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMsg.set(err?.error?.message ?? 'Could not save, please try again.');
        },
      });
  }

  async deleteAccount() {
    this.deleting.set(true);
    this.deleteErrorMsg.set(null);
    try {
      await this.auth.deleteAccount();
      this.router.navigate(['/auth']);
    } catch (err: unknown) {
      const message = (err as { error?: { message?: string } })?.error?.message;
      this.deleteErrorMsg.set(message ?? 'Could not delete your account, please try again.');
      this.deleting.set(false);
    }
  }
}

// backend sends "HH:mm:ss", the native time input wants "HH:mm"
function toTimeInputValue(time: string | null): string {
  return time ? time.slice(0, 5) : '';
}

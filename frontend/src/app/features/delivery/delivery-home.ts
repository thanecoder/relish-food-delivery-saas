import { DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeliveryApiService, DeliveryAssignment } from './delivery-api.service';
import { DeliveryHeader } from './delivery-header';

@Component({
  selector: 'app-delivery-home',
  imports: [DecimalPipe, MatButtonModule, MatProgressSpinnerModule, DeliveryHeader],
  templateUrl: './delivery-home.html',
  styleUrl: './delivery-home.scss',
})
export class DeliveryHome implements OnInit {
  assignments = signal<DeliveryAssignment[]>([]);
  loading = signal(true);
  updating = signal<string | null>(null);

  constructor(private api: DeliveryApiService) {}

  ngOnInit() {
    this.api.getMyAssignments().subscribe({
      next: (list) => {
        this.assignments.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  pickUp(a: DeliveryAssignment) {
    this.updating.set(a.id);
    this.api.markPickedUp(a.id).subscribe({
      next: (updated) => this.replace(updated),
      error: () => this.updating.set(null),
    });
  }

  deliver(a: DeliveryAssignment) {
    this.updating.set(a.id);
    this.api.markDelivered(a.id).subscribe({
      next: (updated) => this.replace(updated),
      error: () => this.updating.set(null),
    });
  }

  private replace(updated: DeliveryAssignment) {
    this.assignments.set(this.assignments().map((a) => (a.id === updated.id ? updated : a)));
    this.updating.set(null);
  }
}

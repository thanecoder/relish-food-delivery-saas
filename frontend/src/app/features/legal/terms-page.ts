import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TermsContent } from '../auth/terms-content';

@Component({
  selector: 'app-terms-page',
  imports: [MatButtonModule, MatIconModule, TermsContent],
  template: `
    <div class="page">
      <button mat-button class="back" (click)="back()">
        <mat-icon>arrow_back</mat-icon> Back
      </button>
      <h1>Terms &amp; Conditions</h1>
      <app-terms-content></app-terms-content>
    </div>
  `,
  styles: `
    .page {
      max-width: 760px;
      margin: 0 auto;
      padding: 24px 20px 64px;
    }
    .back {
      margin: 0 0 8px -8px;
      color: var(--mat-sys-on-surface-variant);
    }
    h1 {
      margin: 0 0 18px;
      font-size: 1.7rem;
    }
  `,
})
export class TermsPage {
  constructor(private location: Location) {}

  back() {
    this.location.back();
  }
}

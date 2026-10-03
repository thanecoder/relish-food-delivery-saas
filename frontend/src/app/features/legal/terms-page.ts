import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TermsContent } from '../auth/terms-content';

@Component({
  selector: 'app-terms-page',
  imports: [MatButtonModule, MatIconModule, TermsContent],
  templateUrl: './terms-page.html',
  styleUrl: './terms-page.scss',
})
export class TermsPage {
  constructor(private location: Location) {}

  back() {
    this.location.back();
  }
}

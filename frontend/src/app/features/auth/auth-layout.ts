import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// both auth steps sit in this, otherwise the form is a small card floating in a lot of nothing
@Component({
  selector: 'app-auth-layout',
  imports: [MatIconModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  // food photos behind the welcome text, credits are in CREDITS.md at the repo root
  photos = [
    '/images/food/margherita.jpg',
    '/images/food/masala-dosa.jpg',
    '/images/food/chicken-tikka.jpg',
    '/images/food/spaghetti-carbonara.jpg',
    '/images/food/tiramisu.jpg',
    '/images/food/classic-smash-burger.jpg',
  ];
}

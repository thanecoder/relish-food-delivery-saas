import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// both auth steps sit in this, otherwise the form is a small card floating in a lot of nothing
@Component({
  selector: 'app-auth-layout',
  imports: [MatIconModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}

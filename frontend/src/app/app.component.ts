import { Component, OnInit } from '@angular/core';
import { Restaurant, RestaurantService } from './restaurant.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'demo';
  restaurants: Restaurant[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe((data) => (this.restaurants = data));
  }
}

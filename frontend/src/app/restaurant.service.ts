import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Restaurant {
  id: number;
  name: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private baseUrl = 'http://localhost:8080/api/restaurants';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.baseUrl);
  }
}

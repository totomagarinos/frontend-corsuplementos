import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { CreateOrderPayload, Order } from '../models/order';
import { Observable } from 'rxjs';

@Service()
export class OrderService {
  private readonly apiUrl = 'http://localhost:8000/api';
  http: HttpClient = inject(HttpClient);

  createOrder(data: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders/`, data);
  }
}

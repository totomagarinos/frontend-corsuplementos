import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { CreateOrderPayload, Order } from '../models/order';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Service()
export class OrderService {
  private readonly apiUrl = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  createOrder(data: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders/`, data);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/`);
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders/${id}/cancel/`, {});
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Service()
export class ProductService {
  private readonly apiUrl = 'http://localhost:8000/api';
  private readonly http: HttpClient = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/`);
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}/`);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Product } from '../models/product';

@Service()
export class ProductService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  getProducts(search?: string): Observable<Product[]> {
    let params = new HttpParams();

    if (search) {
      params = params.append('q', search);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products/`, { params });
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}/`);
  }
}

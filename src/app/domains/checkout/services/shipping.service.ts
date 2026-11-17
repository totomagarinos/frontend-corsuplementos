import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { ShippingOption } from '../models/shipping-option';

@Service()
export class ShippingService {
  private readonly apiUrl = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  getShippingOptions(): Observable<ShippingOption[]> {
    return this.http.get<ShippingOption[]>(`${this.apiUrl}/shipping/`);
  }
}

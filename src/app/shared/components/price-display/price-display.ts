import { AuthService } from '@/app/domains/auth/services/auth.service';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-price-display',
  imports: [],
  templateUrl: './price-display.html',
  styleUrl: './price-display.scss',
})
export class PriceDisplay {
  readonly price = input.required<string>();
  readonly vipPrice = input<string>();

  authService = inject(AuthService);
}

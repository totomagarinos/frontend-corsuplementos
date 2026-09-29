import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { PriceDisplay } from '@/app/shared/components/price-display/price-display';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, CurrencyPipe, PriceDisplay],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  readonly cartService = inject(CartService);
}

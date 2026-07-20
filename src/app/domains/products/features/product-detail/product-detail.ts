import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Variant } from '../../models/variant';
import { CartService } from '@/app/domains/cart/services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly slug = input.required<string>();

  readonly product = signal<Product | null>(null);
  readonly selectedVariant = signal<Variant | null>(null);
  readonly quantity = signal<number>(1);

  ngOnInit(): void {
    this.productService.getProduct(this.slug()).subscribe((data) => {
      this.product.set(data);
    });
  }

  selectVariant(variant: Variant) {
    this.selectedVariant.set(variant);
  }

  updateQuantity(qty: number) {
    this.quantity.set(Math.max(1, qty));
  }

  addToCart() {
    const variant = this.selectedVariant();
    const quantity = this.quantity();

    if (variant) {
      this.cartService.addItem(variant, quantity);
      this.quantity.set(1);
    }
  }
}

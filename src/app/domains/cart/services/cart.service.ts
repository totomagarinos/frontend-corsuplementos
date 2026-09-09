import { computed, effect, Service, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Variant } from '../../products/models/variant';

@Service()
export class CartService {
  private readonly items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly itemsCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.items().reduce((acc, item) => acc + Number(item.variant.price) * item.quantity, 0),
  );

  constructor() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.items.set(JSON.parse(saved) as CartItem[]);
    }

    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });
  }

  addItem(variant: Variant, quantity: number = 1) {
    if (variant.stock > 0) {
      this.items.update((current) => {
        const existing = current.find((item) => item.variant.id === variant.id);
        if (existing) {
          const newQuantity = Math.min(existing.quantity + quantity, variant.stock);
          return current.map((item) =>
            item.variant.id === variant.id ? { ...item, quantity: newQuantity } : item,
          );
        }
        return [...current, { variant, quantity: Math.min(quantity, variant.stock) }];
      });
    }
  }

  removeItem(variantId: number): void {
    this.items.update((current) => current.filter((item) => item.variant.id !== variantId));
  }

  updateQuantity(variantId: number, quantity: number): void {
    this.items.update((current) =>
      current.map((item) => {
        if (item.variant.id !== variantId) return item;
        const capped = Math.min(Math.max(1, quantity), item.variant.stock);
        return { ...item, quantity: capped };
      }),
    );
  }

  clearCart(): void {
    this.items.set([]);
  }
}

import { computed, effect, inject, Service, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Variant } from '../../products/models/variant';
import { LocalKeys, LocalManagerService } from '@/app/shared/services/local-manager.service';
import { AuthService } from '../../auth/services/auth.service';

@Service()
export class CartService {
  localManager = inject(LocalManagerService);
  authService = inject(AuthService);

  private readonly items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly itemsCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));

  readonly subtotal = computed(() => {
    const user = this.authService.currentUser();
    const isVip = user?.is_vip ?? false;

    return this.items().reduce((acc, item) => {
      const activePrice =
        isVip && item.variant.vip_price ? item.variant.vip_price : item.variant.price;

      return acc + Number(activePrice) * item.quantity;
    }, 0);
  });

  constructor() {
    const saved = this.localManager.getData<CartItem[]>(LocalKeys.CART);
    if (saved) {
      this.items.set(saved);
    }

    effect(() => {
      this.localManager.setData(LocalKeys.CART, this.items());
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

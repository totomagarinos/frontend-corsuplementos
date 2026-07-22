import { Component, computed, inject, signal } from '@angular/core';
import { CheckoutFormData, CheckoutSchema } from './checkout-form.schema';
import { safeParse } from 'valibot';
import { CartService } from '@/app/domains/cart/services/cart.service';
import { OrderService, ShippingService } from '../../services';
import { SessionService } from '@/app/core/session.service';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ShippingOption } from '../../models/shipping-option';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-checkout-form',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.scss',
})
export class CheckoutForm {
  readonly cartService = inject(CartService);
  readonly shippingService = inject(ShippingService);
  readonly orderService = inject(OrderService);
  readonly sessionService = inject(SessionService);
  readonly router = inject(Router);

  readonly shippingOptions = toSignal(this.shippingService.getShippingOptions(), {
    initialValue: [],
  });
  readonly selectedShipping = signal<ShippingOption | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly formData = signal<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  readonly total = computed(() => {
    const shippingCost = Number(this.selectedShipping()?.price) || 0;
    return this.cartService.subtotal() + shippingCost;
  });

  readonly validation = computed(() => safeParse(CheckoutSchema, this.formData()));

  selectShipping(option: ShippingOption) {
    this.selectedShipping.set(option);
  }

  updateField(field: keyof CheckoutFormData, value: string) {
    this.formData.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  submit(): void {
    if (!this.validation().success) {
      this.error.set('Por favor, revisa los campos del formulario.');
      return;
    }

    if (!this.selectedShipping()) {
      this.error.set('Por favor, selecciona un método de envío.');
      return;
    }

    const payload = {
      customer_name: this.formData().name,
      customer_email: this.formData().email,
      customer_phone: this.formData().phone,
      shipping_address: `${this.formData().address}, ${this.formData().city}`,
      shipping_option: this.selectedShipping()!.id,
      session_id: this.sessionService.sessionId(),
      notes: this.formData().notes,
      items: this.cartService.cartItems().map((item) => ({
        variant: item.variant.id,
        quantity: item.quantity,
      })),
    };

    this.loading.set(true);
    this.error.set('');

    this.orderService.createOrder(payload).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.cartService.clearCart();
        this.router.navigate(['/order', order.id, 'confirmation']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Error al crear el pedido.');
      },
    });
  }
}

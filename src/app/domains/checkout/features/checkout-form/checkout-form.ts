import { Component, computed, inject, signal } from '@angular/core';
import { CheckoutFormData, CheckoutSchema } from './checkout-form.schema';
import { safeParse } from 'valibot';
import { CartService } from '@/app/domains/cart/services/cart.service';
import { OrderService, ShippingService } from '../../services';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ShippingOption, ShippingType } from '../../models/shipping-option';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaymentMethod } from '../../models/order';

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
  readonly router = inject(Router);

  readonly shippingOptions = toSignal(this.shippingService.getShippingOptions(), {
    initialValue: [],
  });
  readonly selectedShipping = signal<ShippingOption | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly payment_method = signal<PaymentMethod>(PaymentMethod.MERCADO_PAGO);

  readonly PaymentMethod = PaymentMethod;

  readonly departments = ['Capital', 'Rivadavia', 'Chimbas', 'Santa Lucía', 'Rawson', 'Pocito'];

  readonly formData = signal<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    notes: '',
  });

  readonly requiresAddress = computed(
    () => this.selectedShipping()?.type === ShippingType.DELIVERY,
  );

  readonly total = computed(() => {
    const shippingCost = Number(this.selectedShipping()?.price) || 0;
    return this.cartService.subtotal() + shippingCost;
  });

  readonly validation = computed(() => {
    const base = safeParse(CheckoutSchema, this.formData());
    if (!base.success) return { success: false as const };

    if (this.requiresAddress()) {
      const { address, department } = this.formData();
      if (!address || address.trim().length < 8) return { success: false as const };
      if (!department) return { success: false as const };
    }

    return { success: true as const };
  });

  selectShipping(option: ShippingOption) {
    this.selectedShipping.set(option);

    if (option.type !== ShippingType.PICKUP && this.payment_method() === PaymentMethod.EFECTIVO) {
      this.payment_method.set(PaymentMethod.MERCADO_PAGO);
    }
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
      shipping_address: this.requiresAddress()
        ? `${this.formData().address}, ${this.formData().department}`
        : '',
      shipping_option: this.selectedShipping()!.id,
      notes: this.formData().notes,
      items: this.cartService.cartItems().map((item) => ({
        variant: item.variant.id,
        quantity: item.quantity,
      })),
      payment_method: this.payment_method(),
    };

    this.loading.set(true);
    this.error.set('');

    this.orderService.createOrder(payload).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.cartService.clearCart();
        if (order.payment_url) {
          window.location.href = order.payment_url;
        } else {
          this.router.navigate(['/order', order.id, 'confirmation']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Error al crear el pedido.');
      },
    });
  }
}

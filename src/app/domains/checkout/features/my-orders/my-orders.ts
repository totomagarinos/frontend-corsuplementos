import { Component, computed, inject, resource, signal } from '@angular/core';
import { Order, OrderStatus } from '../../models/order';
import { OrderService } from '../../services';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { extractApiErrorMessage } from '@/app/shared/utils/api-error';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders {
  orderService = inject(OrderService);

  // `resource` expone loading, error y valor por separado, así el template
  // puede distinguir "todavía cargando" de "no hay pedidos".
  readonly orders = resource({
    loader: () => firstValueFrom(this.orderService.getMyOrders()),
  });

  readonly orderList = computed(() => this.orders.value() ?? []);

  // Cancelling is a two-step action on purpose: it releases stock, so a
  // single misclick should not be enough.
  readonly confirmingId = signal<number | null>(null);
  readonly cancellingId = signal<number | null>(null);
  readonly actionError = signal('');

  canCancel(order: Order): boolean {
    // Only pending orders. A confirmed order is already paid: undoing it is a
    // refund, not a cancellation.
    return order.status === 'pending';
  }

  askToCancel(order: Order): void {
    this.actionError.set('');
    this.confirmingId.set(order.id);
  }

  dismissCancel(): void {
    this.confirmingId.set(null);
  }

  confirmCancel(order: Order): void {
    this.cancellingId.set(order.id);
    this.actionError.set('');

    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.confirmingId.set(null);
        // The backend already released the stock; reload to show it.
        this.orders.reload();
      },
      error: (err) => {
        this.cancellingId.set(null);
        this.confirmingId.set(null);
        this.actionError.set(
          extractApiErrorMessage(err, 'No pudimos cancelar el pedido.'),
        );
      },
    });
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      delivered: 'Entregado',
      payment_rejected: 'Pago rechazado',
    };
    return labels[status] ?? status;
  }
}

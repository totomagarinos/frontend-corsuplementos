import { Component, inject } from '@angular/core';
import { Order, OrderStatus } from '../../models/order';
import { OrderService } from '../../services';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders {
  orderService = inject(OrderService);

  orders = toSignal(this.orderService.getMyOrders(), { initialValue: [] });

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

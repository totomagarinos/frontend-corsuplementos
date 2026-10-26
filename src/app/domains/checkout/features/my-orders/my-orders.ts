import { Component, computed, inject, resource } from '@angular/core';
import { Order, OrderStatus } from '../../models/order';
import { OrderService } from '../../services';
import { firstValueFrom } from 'rxjs';
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

  // `resource` expone loading, error y valor por separado, así el template
  // puede distinguir "todavía cargando" de "no hay pedidos".
  readonly orders = resource({
    loader: () => firstValueFrom(this.orderService.getMyOrders()),
  });

  readonly orderList = computed(() => this.orders.value() ?? []);

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

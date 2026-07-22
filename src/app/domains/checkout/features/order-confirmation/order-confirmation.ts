import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-confirmation',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss',
})
export class OrderConfirmation implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly id = input.required<string>();
  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.orderService.getOrder(Number(this.id())).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}

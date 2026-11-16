import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { CreateOrderPayload, PaymentMethod } from '../models/order';

describe('OrderService', () => {
  const apiUrl = 'http://localhost:8000/api';

  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('posts a new order to /orders/', () => {
    const payload: CreateOrderPayload = {
      customer_name: 'Test Buyer',
      customer_email: 'buyer@example.com',
      customer_phone: '2640000000',
      shipping_address: '',
      shipping_option: 1,
      notes: '',
      items: [{ variant: 7, quantity: 2 }],
      payment_method: PaymentMethod.MERCADO_PAGO,
    };

    service.createOrder(payload).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/orders/`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({});
  });

  it('posts a cancellation to /orders/{id}/cancel/', () => {
    service.cancelOrder(42).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/orders/42/cancel/`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({});
    request.flush({ id: 42, status: 'cancelled' });
  });

  it('lists the current user orders from /orders/', () => {
    service.getMyOrders().subscribe();

    const request = httpMock.expectOne(`${apiUrl}/orders/`);
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});

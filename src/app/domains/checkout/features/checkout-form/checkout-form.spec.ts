import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CheckoutForm } from './checkout-form';
import { ShippingType } from '../../models/shipping-option';

describe('CheckoutForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('charges only the cart subtotal, never the delivery price', () => {
    const fixture = TestBed.createComponent(CheckoutForm);
    const component = fixture.componentInstance;

    component.cartService.addItem(
      {
        id: 1,
        sku: 'PRO-500-VAI',
        size: '500g',
        flavor: 'Vainilla',
        product_name: 'Proteína',
        price: '1000',
        vip_price: '',
        stock: 10,
      },
      2,
    );

    component.selectedShipping.set({
      id: 7,
      name: 'Envío Local (Uber)',
      description: '',
      price: '3000',
      estimated_days: '',
      type: ShippingType.DELIVERY,
    });

    expect(component.cartService.subtotal()).toBe(2000);
    expect(component.total()).toBe(2000);
  });
});

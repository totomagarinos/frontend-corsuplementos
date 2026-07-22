import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./domains/products/features/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./domains/products/features/product-detail/product-detail').then(
        (m) => m.ProductDetail,
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./domains/cart/features/cart-page/cart-page').then((m) => m.CartPage),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./domains/checkout/features/checkout-form/checkout-form').then((m) => m.CheckoutForm),
  },
  {
    path: 'order/:id/confirmation',
    loadComponent: () =>
      import('./domains/checkout/features/order-confirmation/order-confirmation').then(
        (m) => m.OrderConfirmation,
      ),
  },
];

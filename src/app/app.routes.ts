import { Routes } from '@angular/router';
import { authGuard } from './domains/auth/guards/auth-guard';

export const appRoutes = {
  public: {
    login: 'login',
    register: 'register',
    products: '',
    productDetail: 'products/:slug',
    cart: 'cart',
  },
  private: {
    root: '',
    checkout: 'checkout',
    confirmation: 'order/:id/confirmation',
  },
};

export const routes: Routes = [
  {
    path: appRoutes.public.login,
    title: 'Iniciar sesión | Corsuplementos',
    loadComponent: () => import('./domains/auth/login/login').then((m) => m.Login),
  },
  {
    path: appRoutes.public.register,
    title: 'Crear cuenta | Corsuplementos',
    loadComponent: () => import('./domains/auth/register/register').then((m) => m.Register),
  },
  {
    path: appRoutes.public.products,
    title: 'Productos | Corsuplementos',
    loadComponent: () =>
      import('./domains/products/features/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: appRoutes.public.productDetail,
    loadComponent: () =>
      import('./domains/products/features/product-detail/product-detail').then(
        (m) => m.ProductDetail,
      ),
  },
  {
    path: appRoutes.public.cart,
    title: 'Carrito | Corsuplementos',
    loadComponent: () =>
      import('./domains/cart/features/cart-page/cart-page').then((m) => m.CartPage),
  },
  {
    path: appRoutes.private.root,
    canActivateChild: [authGuard],
    children: [
      {
        path: appRoutes.private.checkout,
        title: 'Checkout | Corsuplementos',
        loadComponent: () =>
          import('./domains/checkout/features/checkout-form/checkout-form').then(
            (m) => m.CheckoutForm,
          ),
      },
      {
        path: appRoutes.private.confirmation,
        title: 'Confirmación | Corsuplementos',
        loadComponent: () =>
          import('./domains/checkout/features/order-confirmation/order-confirmation').then(
            (m) => m.OrderConfirmation,
          ),
      },
    ],
  },
];

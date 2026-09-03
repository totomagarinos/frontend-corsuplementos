import { Variant } from '../../products/models/variant';

export interface OrderItem {
  variant: Variant;
  quantity: number;
  variant_name: string;
  price: string;
  subtotal: string;
}

export enum PaymentMethod {
  MERCADO_PAGO = 'mercado_pago',
  EFECTIVO = 'efectivo',
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'delivered' | 'payment_rejected';

export interface Order {
  id: number;
  user: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_option: number;
  shipping_address: string;
  shipping_cost: string;
  subtotal: string;
  total: string;
  notes: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_url: string | null;
  mercadopago_preference_id: string;
  mercadopago_payment_id: string;
  stock_deducted: boolean;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_option: number;
  notes?: string;
  items: { variant: number; quantity: number }[];
  payment_method: PaymentMethod;
}

import { Variant } from '../../products/models/variant';

export interface OrderItem {
  variant: Variant;
  quantity: number;
  variant_name: string;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  session_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_option: number;
  shipping_address: string;
  shipping_cost: string;
  subtotal: string;
  total: string;
  notes: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_option: number;
  session_id: string;
  notes?: string;
  items: { variant: number; quantity: number }[];
}

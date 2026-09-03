export enum ShippingType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  NATIONAL = 'national',
}

export interface ShippingOption {
  id: number;
  name: string;
  description: string;
  price: string | null;
  estimated_days: string;
  type: ShippingType;
}

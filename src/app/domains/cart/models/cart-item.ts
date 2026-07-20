import { Variant } from '../../products/models/variant';

export interface CartItem {
  variant: Variant;
  quantity: number;
}

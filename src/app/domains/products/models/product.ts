import { Variant } from './variant';

export interface Product {
  id: number;
  brand: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  category_display: string;
  base_price: string;
  image: string;
  variants: Variant[];
}

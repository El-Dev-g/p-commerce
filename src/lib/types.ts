
export type ProductVariation = {
  id?: string;
  attributes: { name: string; value: string }[];
  sku?: string;
  stock: number;
  priceModifier?: number;
};

export type Product = {
  id: string;
  name: string;
  nameB?: string; // For A/B testing
  description: string;
  price: number;
  category: string;
  image: {
    src: string;
    alt: string;
    'data-ai-hint': string;
  };
  variations?: ProductVariation[];
};

export type CartItem = {
  product: Product;
  quantity: number;
  variation?: ProductVariation;
};

export type Order = {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: CartItem[];
  total: number;
  orderDate: string;
  trackingNumber?: string;
  carrier?: string;
};

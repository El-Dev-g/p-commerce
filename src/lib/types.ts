export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: {
    src: string;
    alt: string;
    'data-ai-hint': string;
  };
};

export type CartItem = {
  product: Product;
  quantity: number;
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
};

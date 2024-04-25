export interface simplifiedProduct {
  id: string;
  imageURL: string;
  price: number;
  slug: string;
  categoryName: string;
  name: string;
}

export interface fullProduct {
  id: any;
  imageURL: string;
  price: number;
  slug: string;
  categoryName: string;
  name: string;
  description: string;
}

export interface newProduct {
    id: any;
    imageURL: string;
    price: number;
    name: string;
    description: string;
  }

export interface ShoppingCartState {
  items: Array<{
    id: number;
    imageURL: string;
    slug: string;
    categoryName: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
  }>;
  total: number;
}

export interface ShoppingCartActions {
  addItem: (
    id: number,
    name: string,
    price: number,
    description: string,
    slug: string,
    categoryName: string,
    imageURL: string
  ) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  handleCartClick: () => void;
  isVisible: boolean;
}

export type ShoppingCartHook = ShoppingCartState & ShoppingCartActions;

"use client";

import { useContext, createContext, ReactNode, useState } from "react";
import { fullProduct } from "@/app/interface";
import ShoppingCartModal from "@/components/ShoppingCartModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
  data: fullProduct[];
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  toggleCart: (v: boolean) => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  data: fullProduct[];
  isOpen: boolean;
};

export const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({
  children,
  data,
}: ShoppingCartProviderProps) {

  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  )

  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleCart = (v: boolean) => {
    setOpen(!isOpen);
  };

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        toggleCart,
        data,
        isOpen,
      }}
    >
      {children}
      <ShoppingCartModal data={data} />
    </ShoppingCartContext.Provider>
  );
}

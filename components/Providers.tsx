import { useState } from "react";
import {
  ShoppingCartHook,
  ShoppingCartState,
  ShoppingCartActions,
} from "@/app/interface";

export const useShoppingCart = (): ShoppingCartHook => {
  const [state, setState] = useState<ShoppingCartState>({
    items: [],
    total: 0,
  });
  const [isVisible, setVisible] = useState<boolean>(true);

  const addItem = (
    id: number,
    name: string,
    price: number,
    description: string,
    slug: string,
    categoryName: string,
    imageURL: string
  ) => {
    const existingItem = state.items.find((item) => item.id === id);

    if (existingItem) {
      updateQuantity(id, existingItem.quantity + 1);
    } else {
      const newItem = {
        id,
        name,
        price,
        description,
        slug,
        categoryName,
        imageURL,
        quantity: 1,
      };

      setState((prevState) => ({
        ...prevState,
        items: [...prevState.items, newItem],
        total: prevState.total + price,
      }));
    }
  };

  const removeItem = (id: number) => {
    const itemIndex = state.items.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      const item = state.items[itemIndex];
      const updatedItems = state.items.filter((item) => item.id !== id);
      const updatedTotal = state.total - item.price * item.quantity;

      setState((prevState) => ({
        ...prevState,
        items: updatedItems,
        total: updatedTotal,
      }));
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    const item = state.items.find((item) => item.id === id);

    if (item) {
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      const updatedTotal =
        state.total - item.price * item.quantity + item.price * quantity;

      setState((prevState) => ({
        ...prevState,
        items: updatedItems,
        total: updatedTotal,
      }));
    }
  };

  const clearCart = () => {
    setState({
      items: [],
      total: 0,
    });
  };

 const handleCartClick = () => setVisible(!isVisible);

  return {
    ...state,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    handleCartClick,
    isVisible,
  };
};

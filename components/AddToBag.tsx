"use client";

import { fullProduct, newProduct } from "@/app/interface";
import { Button } from "@/components/ui/button";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";

export default function AddToBag({
  description,
  imageURL,
  name,
  price,
  id,
}: newProduct) {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  const product = {
    name: name,
    description: description,
    price: price,
    imageURL: imageURL,
    id: id,
  };
  return <Button onClick={() => increaseCartQuantity(id)}>Add to Cart</Button>;
}

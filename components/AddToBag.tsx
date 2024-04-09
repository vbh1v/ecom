"use client";

import { urlFor } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import { useShoppingCart } from "use-shopping-cart";

export interface ProductCart {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: any;
}

export default function AddToBag({currency, description, image, name, price}: ProductCart) {
  const { addItem, handleCartClick } = useShoppingCart();

  const product ={
    name: name,
    description: description,
    price: price,
    currency: currency,
    image: urlFor(image).url(),
    id:"jsaksj",
  }
  return <Button onClick={() => {
    addItem(product), handleCartClick();
  }}>Add to Cart</Button>;
}

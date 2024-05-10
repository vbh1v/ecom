"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CartItem } from "./CartItem";
import { fullProduct } from "@/app/interface";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";


interface ShoppingCartModalProps {
  data: fullProduct[];
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ data }) => {
  const { cartItems, isOpen, toggleCart } = useShoppingCart();

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div className="h-full flex flex-col justify-between">
          <div className="mt-8 flex-1 overflow-y-auto">
            {cartItems.map((item) => (
              <CartItem key={item.id} {...item} data={data} />
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal:</p>
              <p>
                ₹
                {cartItems.reduce((total, cartItem) => {
                  const item = data.find((i) => i.id === cartItem.id);
                  return total + (item?.price ?? 0) * cartItem.quantity;
                }, 0)}
              </p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes are calculated at checkout
            </p>
            <div className="mt-6">
              <Button className="w-full">Checkout</Button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                OR{" "}
                <button
                  onClick={() => console.log("hello")}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Continue Shopping
                </button>
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default dynamic(() => Promise.resolve(ShoppingCartModal), {
  ssr: false,
});

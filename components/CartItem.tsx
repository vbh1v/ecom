import { fullProduct } from "@/app/interface";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import axios from "axios";
import Image from "next/image";

type CartItemProps = {
  id: any;
  quantity: number;
  data: fullProduct[];
};

export function CartItem({ id, quantity, data}: CartItemProps) {
//   const {
//     openCart,
//     closeCart,
//     getItemQuantity,
//     increaseCartQuantity,
//     decreaseCartQuantity,
//     removeFromCart,
//     cartQuantity,
//     cartItems,
//   } = useShoppingCart();

  const item = data.find((i) => i.id === id);
  if (item == null) return null

  

  return (
    <div>
      <li key={item.id} className="flex py-6">
        
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <Image
            src={
              item.imageURL
            }
            alt="Product Image"
            width={100}
            height={100}
          />
        </div>
        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900 font-cormorant">
              <h3>{item.name}</h3>
              <p className="ml-4">₹{item.price}</p>
            </div>
            {/* add description */}
            <p className="mt-1 text-sm text-gray-500 line-clamp-2 font-cormorant">
              {item.description}
            </p>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p>Quantity: {item.price * quantity}</p>
            <div className="flex">
              <button
                type="button"
                // onClick={() => removeFromCart(item.id)}
                className="font-medium text-primary hover:text-primary/80"
              >
                Remove
              </button>
              <button
                type="button"
                //   onClick={() => removeFromCart(item.id)}
                className="font-medium text-primary hover:text-primary/80"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
}

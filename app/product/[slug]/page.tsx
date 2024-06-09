"use client";
import ImageGalleryNew from "@/components/ImageGalleryNew";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import axios from "axios";
import { fullProduct } from "@/app/interface";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { useState, useEffect } from "react";


export async function getData(slug: string) {
  try {
    const response = await axios.get(
      `http://localhost:3002/product?slug=${slug}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<fullProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    toggleCart,
  } = useShoppingCart();
  // const quantity = getItemQuantity(id)

  useEffect(() => {
    (async () => {
      const response = await getData(params.slug);
      const result = response?.data[0] ?? null; // Extract data from the response
      setData(result);
      setIsLoading(false);

      console.log({ data: response?.data, slug: params.slug });
    })();
  }, [params.slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-red">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGalleryNew imageUrl={data?.imageURL} />
          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <span className="mb-05 inline-block text-gray-500">
                {data?.categoryName}
              </span>
              <h2 className="text-2xl font-cormorant lg:text-3xl">
                {data?.name}
              </h2>
            </div>
            <div className="mb-6 flex items-center gap-3 md:mb-10">
              <Button>4.2 ⭐</Button>
              <span className="text-sm text-gray-500 transition duration-100">
                56 Ratings
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-800 md:text-2xl">
                  ₹{data?.price}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Inclusive of GST and shipping.
              </span>
            </div>
            <div className="mb-6 flex items-center gap text-gray-500">
              <Truck />
              <span className="p-2">2-4 days of shipping</span>
            </div>
            <div className="flex gap-2.5">
              <Button
                onClick={() => {
                  increaseCartQuantity(data?.id);
                  toggleCart(false);
                }}
              >
                Add to Cart
              </Button>
              <Button variant={"secondary"}>Checkout Now</Button>
            </div>
            <p className="mt-12 text-base text-gray-500 tracking-wide">
              {data?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

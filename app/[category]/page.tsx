"use client";
import AddToBag from "@/components/AddToBag";
import ImageGalleryNew from "@/components/ImageGalleryNew";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import axios from "axios";
import { fullProduct } from "@/app/interface";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export async function getData(category: string) {
  try {
    const response = await axios.get(
      `http://localhost:3002/product?category=${category}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


export default function CategoryPage({ params }: { params: { category: string } }) {
  const [data, setData] = useState<fullProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("response is", data)

  const {
    increaseCartQuantity,
    toggleCart,
  } = useShoppingCart();

  useEffect(() => {
    (async () => {
      const response = await getData(params.category);
      const result = response?.data ?? null; // Extract data from the response
      setData(result);
      setIsLoading(false);

      console.log({ data: response?.data, category: params.category });
    })();
  }, [params.category]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-red">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      <div className="flex">
        {data?.map((data) => (
          <div key={data.id} className="flex flex-col items-center">
            <div className="bg-gray">
              <Image
                src={data.imageURL}
                alt="product image"
                width={300}
                height={300}
              />
            </div>
            <div className="flex flex-col items-center">
              <Link href={`/product/${data.slug}`}>
                <h2 className="text-xs">{data.name}</h2>
              </Link>
              <p>₹ {data.price}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

"use client";

import { fullProduct } from "@/app/interface";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export default function Newest({ data }) {
  console.log("NEWEST", data);

  return (
    <div className="flex flex-col font-cormorant">
      <div className="p-4">
        <Label className="text-4xl">New Arrivals</Label>
      </div>

      <div className="flex">
        {data.map((data: fullProduct) => (
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
  );
}

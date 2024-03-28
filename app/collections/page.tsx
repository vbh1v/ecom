"use client";

import { Label } from "@radix-ui/react-label";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-col">
      <div className="p-4">
        <Label className="text-4xl font-cormorant">Collections</Label>
      </div>

      <div className="p-2 flex flex-col items-center">
        <Image
          src="/1.png"
          width="300"
          height="300"
          alt="tshirt"
          className="rounded-md p-4 object-cover"
        />
        <Label className="font-cormorant">Hoodies</Label>
      </div>
      <div className="p-2 flex flex-col items-center">
        <Image
          src="/2.png"
          width="300"
          height="300"
          alt="hoodie"
          className="rounded-md p-4 object-cover"
        />
        <Label className="font-cormorant">Tshirt</Label>
      </div>
    </main>
  );
}

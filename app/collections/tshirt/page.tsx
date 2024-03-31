"use client";

import Newest from "@/components/Newest";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-col md:flex-row">
      <div className="p-4">
        <Label className="text-4xl font-cormorant">Tshirt</Label>
      </div>
    </main>
  );
}

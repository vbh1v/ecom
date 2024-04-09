"use client";

import Newest from "@/components/Newest";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-col md:flex-row">
      <Newest/>
    </main>
  );
}

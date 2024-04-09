
"use client"

import Link from "next/link";
import { simplifiedProduct } from "../interface";
import { client } from "../lib/sanity";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import Newest from "@/components/Newest";

async function getData(category: string) {
  const query = `*[_type == "product" && category->name == "${category}"]{
    _id,
      "imageUrl": images[0].asset->url,
        price,
      name,
      "slug": slug.current,
      "categoryName": category->name
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const data: simplifiedProduct[] = await getData(params.category);

  return (
    
      <Newest />
    
  );
}

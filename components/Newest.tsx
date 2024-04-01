import { simplifiedProduct } from "@/app/interface";
import { client } from "@/app/lib/sanity";
import product from "@/sanity/schemaTypes/product";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import Link from "next/link";

export async function getData() {
  const query = `*[_type == 'product'][0...4] | order(_createdAt desc){
        _id,
          price,
          name,
          "slug": slug.current,
          "categoryName": category->name,
          "imageUrl": images[0].asset->url
      }`;
  const data = await client.fetch(query);

  return data;
}

export default async function Newest() {
  const data: simplifiedProduct[] = await getData();
  //   console.log(data);

  return (
    <div className="flex flex-col font-cormorant">
      <div className="p-4">
        <Label className="text-4xl">New Arrivals</Label>
      </div>

      <div className="flex">
        {data.map((product) => (
          <div key={product._id} className="flex flex-col items-center">
            <div className="bg-gray">
              <Image
                src={product.imageUrl}
                alt="product image"
                width={300}
                height={300}
              ></Image>
            </div>
            <div className="flex flex-col items-center">
              <Link href={`/product/${product.slug}`}>
                <h2 className="text-xs">{product.name}</h2>
              </Link>
              <p>₹ {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

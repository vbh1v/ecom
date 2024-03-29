import { simplifiedProduct } from "@/app/interface";
import { client } from "@/app/lib/sanity"
import product from "@/sanity/schemaTypes/product";
import Image from "next/image";

export async function getData() {
    const query = `*[_type == 'product'][0...4] | order(_createdAt desc){
        _id,
          price,
          name,
          "slug": slug.current,
          "categoryName": category->name,
          "imageUrl": images[0].asset->url
      }`
      const data = await client.fetch(query);

      return data
}

export default async function Newest() {
    const data: simplifiedProduct[] = await getData()

    return(
        <div><h2>Our Newest Product</h2>
        <div>
            {data.map(product => (
                <div key={product._id}>
                    <div>
                        <Image src={product.imageUrl} alt="product image" width={300} height={300}></Image>
                    </div>
                </div>
            ))}
        </div>
        </div>
        
    )
}

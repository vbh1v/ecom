import { fullProduct } from "@/app/interface";

import AddToBag from "@/components/AddToBag";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

async function getData(slug: string) {
  // const query = `*[_type == 'product' && slug.current == "siesta-tshirt-cedar-brown"][0]{
  //   _id,
  //     images,
  //     price,
  //     name,
  //     description,
  //     "slug": slug.current,
  //     "categoryName": category->name,
  // }`;
  // const data = await client.fetch(query);

  // return data;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // const data: fullProduct = await getData(params.slug);
  return (
    <div className="bg-red">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGallery images={data.images} />
          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <span className="mb-05 inline-block text-gray-500">
                {data.categoryName}
              </span>
              <h2 className="text-2xl font-cormorant lg:text-3xl">
                {data.name}
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
                  ₹{data.price}
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
              <AddToBag
                currency="INR"
                description={data.description}
                image={data.images[0]}
                name={data.name}
                price={data.price}
                key={data._id}
              />
              <Button variant={"secondary"}>Checkout Now</Button>
            </div>
            <p className="mt-12 text-base text-gray-500 tracking-wide">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

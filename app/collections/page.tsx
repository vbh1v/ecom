import Newest from "@/components/Newest";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import axios from "axios";

export async function getData() {
  try {
    const response = await axios.get("http://localhost:3007/api/products/?skip=4");
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function Home() {
  const res = await getData();
  const data = res?.data;
  console.log(data);

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
      <Newest data={data} />
    </main>
  );
}

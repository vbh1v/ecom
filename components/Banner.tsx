import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { client, urlFor } from "@/app/lib/sanity"

async function getData() {
  const query = "*[_type == 'heroImage'][0]"

  const data = await client.fetch(query)

  return data
}



const Banner: React.FC = async () => {
  const data = await getData();  
  return (
        <div className="relative flex">
          <Image src={urlFor(data.image1).url()} width='3000' height='1000' alt="Image" className="rounded-md object-center w-full" priority />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <Label className="p-2 space-x-2 text-lg text-[#FFFFFF]">Stand Out.</Label>
          <Button className=""variant="secondary">Order Now</Button>
          </div>
        </div>
    )
} 

export default Banner;
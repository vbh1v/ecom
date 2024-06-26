import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"





const Banner: React.FC = () => {
  return (
        <div className="relative flex">
          <Image src="/tshirt.png" width='3000' height='1000' alt="Image" className="rounded-md object-center w-full" priority />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <Label className="p-2 space-x-2 text-lg text-[#FFFFFF]">Stand Out.</Label>
          <Button className=""variant="secondary" >Order Now</Button>
          </div>
        </div>
    )
} 

export default Banner;
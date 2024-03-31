import Image from "next/image";
import { Label } from "@/components/ui/label";
import Newest from "./Newest";

const CollectionList: React.FC = () => {
  return (
    <div className="p-4 flex flex-col items-center justify-around">
      <Label className="text-xl font-cormorant">Shop by category:</Label>
      <div className="flex justify-evenly">
        <div className="border-black flex flex-col items-center">
          <Image
            src="/1.png"
            width="250"
            height="250"
            alt="tshirt"
            className="rounded-md p-4 object-cover"
          />
          <Label className="font-cormorant">Hoodies</Label>
        </div>
        <div className="border-black flex flex-col items-center">
          <Image
            src="/2.png"
            width="250"
            height="250"
            alt="hoodie"
            className="rounded-md p-4 object-cover"
          />
          <Label className="font-cormorant">Tshirt</Label>
        </div>
      </div>
    </div>
  );
};

export default CollectionList;

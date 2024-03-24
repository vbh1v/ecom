import Image from "next/image"
import { Label } from "@/components/ui/label"

const CollectionList: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            <Label className="p-4 space-x-6 text-3xl justify-center font-cormorant">Shop by category:</Label>
            <div className="flex flex-row justify-between">
                <Image src='/1.png' width='250' height='250' alt="tshirt" className="rounded-md p-4 object-cover" />
                <Image src='/2.png' width='250' height='250' alt="hoodie" className="rounded-md p-4 object-cover" />
            </div> 
        </div>
    )
} 

export default CollectionList;
import React from 'react';
import { Icons } from './icons';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"


const Footer: React.FC = () => {
  return <div>
  <div className="p-2 flex flex-col border-2 border-black items-center">
  <Label className=" text-xl font-cormorant border-2 border-black">Subscribe to our emails</Label>
      <form className='flex items-center'>
        <div className="flex items-center">
          <div className="flex flex-col justify-between items-center">
            <Input className="w-full" id="name" placeholder="Enter your email" />
            <div className='flex p-2'>
            <Icons.google className='p-1'/>
            <Icons.twitter className='p-1'/>
            <Icons.instagram className='p-1'/>
            </div>
          </div>
        </div>
      </form>
  </div>
  <Separator/>
  <div className="px-4 flex flex-wrap justify-center font-cormorant">
    <ul className="flex flex-wrap justify-center text-xs">
      <li className="m-1">Refund policy</li>
      <li className="m-1">Privacy policy</li>
      <li className="m-1">Terms of service</li>
      <li className="m-1">Shipping policy</li>
      <li className="m-1">Contact information</li>
    </ul>
  </div>
  
  </div> 
};

export default Footer;
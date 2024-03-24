import React from 'react';
import { Icons } from './icons';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"


const Footer: React.FC = () => {
  return <div className='gap-4'>
  <div className="flex justify-center">
  <div className="w-[1000px]">
  <Label className="p-2 mb-4 text-2xl font-cormorant">Enter your emails</Label>
      <form className='flex items-center gap-4'>
        <div className="grid w-full items-center gap-4">
          <div className="flex p-2 justify-between items-center">
            <Input className="w-[350px] mb-4" id="name" placeholder="Enter your email" />
            <div className='flex gap-2'>
            <Icons.google className='w-[12px]'/>
            <Icons.twitter className='h-[12px]'/>
            <Icons.instagram className='w-[12px]'/>
            </div>
          </div>
        </div>
      </form>
  </div>
  </div>
  <Separator/>
  <div className='flex gap-2 justify-center'> 
  <Label>Refund policy</Label>
  <Label>Privacy policy</Label>
  <Label>Terms of service</Label>
  <Label>Shipping policy</Label>
  <Label>Contact information</Label>
  </div>
  </div> 
};

export default Footer;
"use client";

import Image from "next/image";

interface MyComponentProps {
  imageUrl: string;
}

const ImageGalleryNew: React.FC<MyComponentProps> = ({ imageUrl }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="order-last flex gap-4 lg:order-none lg:flex-col">
        <div className="rounded-lg bg-red-100">
          <Image
            src={imageUrl}
            width={200}
            height={200}
            alt="photo nahi dikh raha"
            className="h-full w-full object-center cursor-pointer"
          />
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
        <Image
          src={imageUrl}
          alt="photo"
          width={500}
          height={500}
          className="h-full w-full object-cover object-center"
        />
        <span className="absolute left-0 top-0 rounder-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
          Sale
        </span>
      </div>
    </div>
  );
};

export default ImageGalleryNew;

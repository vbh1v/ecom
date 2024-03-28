"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import React from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const Logo = () => {
  return (
    <div className="flex flex-grow justify-center">
      <Image src="/logo.svg" width={40} height={40} alt="Logo" />
    </div>
  );
};

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Icons } from "./icons";

const Navbar: React.FC = () => {
  const menuList = [
    {
      group: "Shop",
      items: [
        {
          link: "/",
          text: "All products",
        },
        {
          link: "/",
          text: "Tshirt",
        },
        {
          link: "/",
          text: "Hoodies",
        },
      ],
    },
    {
      group: "About Us",
      items: [
        {
          link: "/",
          text: "Our Story",
        },
        {
          link: "/",
          text: "Contact",
        },
      ],
    },
  ];

  return (
    <header className="flex sticky top-0 bg-background z-10 shadow-sm justify-center">
      <NavigationMenu className="flex">
        <Drawer direction={"left"}>
          <DrawerTrigger asChild>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.hamburger />
            </NavigationMenuLink>
          </DrawerTrigger>
          <DrawerContent className="h-full w-[85%]">
            <DrawerHeader className="text-left">
              <DrawerTitle>
                <DrawerTrigger asChild>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Icons.cross />
                  </NavigationMenuLink>
                </DrawerTrigger>
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="overflow-auto p-4 break-all">
              <Command>
                <CommandList>
                  {menuList.map((menu: any, key: number) => (
                    <CommandGroup key={key} heading={menu.group}>
                      {menu.items.map((option: any, optionKey: number)=> <CommandItem key={optionKey}>{option.text}</CommandItem>)}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </ScrollArea>
            <DrawerFooter className="pt-2">
              <p className="text-sm italic">
                Thank you for <strong>diligently</strong> double checking!
              </p>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </NavigationMenu>

      <Logo />

      <div className="flex">
        <NavigationMenu>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.search />
            </NavigationMenuLink>
          </Link>
          <div className="hidden md:flex">
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Icons.person />
              </NavigationMenuLink>
            </Link>
          </div>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.shoppingbag />
            </NavigationMenuLink>
          </Link>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;

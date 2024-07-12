"use client";

import Image from "next/image";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import React from "react";
import { SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { ScrollArea } from "@/components/ui/scroll-area";

const Logo = () => {
  return (
    <div className="flex flex-grow justify-center">
      <Image src="/logo.svg" width={40} height={40} alt="Logo" />
    </div>
  );
};

import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Icons } from "./icons";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";

const Navbar: React.FC = () => {
  const { toggleCart } = useShoppingCart();

  const menuList = [
    {
      group: "Shop",
      items: [
        {
          link: "/collections",
          text: "All products",
        },
        {
          link: "/Tshirts",
          text: "Tshirt",
        },
        {
          link: "/Hoodies",
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
                <SheetTrigger asChild>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Icons.cross />
                  </NavigationMenuLink>
                </SheetTrigger>
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="overflow-auto p-4 break-all">
              <Command>
                <CommandList>
                  {menuList.map((menu: any, key: number) => (
                    <CommandGroup key={key} heading={menu.group}>
                      {menu.items.map((option: any, optionKey: number) => (
                        <SheetTrigger asChild key={optionKey}>
                          <Link href={option.link} key={optionKey} passHref>
                            <CommandItem key={optionKey}>
                              {option.text}
                            </CommandItem>
                          </Link>
                        </SheetTrigger>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </ScrollArea>
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
            <Link href="/login" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Icons.person />
              </NavigationMenuLink>
            </Link>
          </div>
          <NavigationMenuLink
            onClick={() => toggleCart(false)}
            className={navigationMenuTriggerStyle()}
          >
            <Icons.shoppingbag />
          </NavigationMenuLink>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;

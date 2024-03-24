"use client"

import Image from 'next/image'
import Link from "next/link"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import React from 'react';


const Logo = () => {
    return (
        <div className="flex items-center">
        <Image 
          src='/logo.svg'
          width={40}
          height={40}
          alt="Logo"
        />
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
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"



  

const Navbar: React.FC = () => {

  return (
    <header className='sticky top-0 bg-background z-10 shadow-sm'>
      <div className="flex p-2 justify-evenly">
    <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Tshirt</NavigationMenuLink>
                    </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>About</NavigationMenuLink>
                    </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>

    <Logo/>
    <NavigationMenu>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Image 
                        src='/search.svg'
                        width={20}
                        height={20}
                        alt="search-icon"
                    />
            </NavigationMenuLink>
          </Link>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Image 
                        src='/account.svg'
                        width={20}
                        height={20}
                        alt="account-icon"
                    />
            </NavigationMenuLink>
          </Link>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Image 
                        src='/shopping-bag.svg'
                        width={20}
                        height={20}
                        alt="shopping_bag-icon"
                    />
            </NavigationMenuLink>
          </Link>
    </NavigationMenu>
  </div>
    </header>
  );
};

export default Navbar;

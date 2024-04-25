import { Separator } from "@/components/ui/separator";
import Body from "@/components/Body";
import Announcement from "@/components/Announcement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShoppingCartContext,
  ShoppingCartProvider,
} from "@/contexts/ShoppingCartContext";
import axios from "axios";
import { fullProduct } from "./interface";
import { CartItem } from "@/components/CartItem";

export async function getData(): Promise<fullProduct[]> {
  // Annotate return type as Promise<Product[]>
  try {
    const response = await axios.get<fullProduct[]>(
      "http://localhost:3002/product"
    ); // Specify generic type parameter
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return empty array as fallback
  }
}

export default async function Home() {
  const data = await getData();

  interface qProduct {
    id: any;
    imageURL: string;
    price: number;
    slug: string;
    categoryName: string;
    name: string;
    description: string;
    quantity: number;
  }

  const user: qProduct = {
    id: 2,
    imageURL: "lol",
    price: 30,
    slug: "hehe",
    categoryName: "lol category",
    name: "hello",
    description: "string",
    quantity: 3,
  };

  return (
    <main>
      <ShoppingCartProvider data={data}>
        <Announcement />
        <Navbar />
        <Separator />
        <Body />
        <Separator />
        <CartItem key={2} {...user} data={data} />
        <Footer />
      </ShoppingCartProvider>
    </main>
  );
}

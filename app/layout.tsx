import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Cormorant } from "next/font/google";

import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext";
import axios from "axios";
import { fullProduct } from "./interface";
import Navbar from "@/components/Navbar";
import Announcement from "@/components/Announcement";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant", // <--------- 👈
});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getData();


  return (

    
    <html lang="en">
      <body className={`${cormorant.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ShoppingCartProvider data={data}>
            
            {children}
            
            
          </ShoppingCartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

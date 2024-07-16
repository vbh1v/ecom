
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Cormorant } from "next/font/google";

import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext";
import axios from "axios";
import { fullProduct } from "./interface";
import SessionProvider  from "@/components/SessionProvider"
import { getServerSession } from "next-auth";


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
  const session = await getServerSession()
  console.log(session)


  return (

    
    <html lang="en">

      <body className={`${cormorant.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
          <ShoppingCartProvider data={data}>
            
            {children}
            
            
          </ShoppingCartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

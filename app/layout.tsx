import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Announcement from "@/components/Announcement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cormorant } from "next/font/google";
import { Separator } from "@/components/ui/separator";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant", // <--------- 👈
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          
          {children}
          
        </ThemeProvider>
      </body>
    </html>
  );
}

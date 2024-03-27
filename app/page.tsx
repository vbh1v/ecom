import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Separator } from "@/components/ui/separator"
import Body from "@/components/Body";
import { Cormorant } from 'next/font/google'
import Announcement from "@/components/Announcement";

const cormorant = Cormorant({
  subsets: ['latin'],
  variable: '--font-cormorant',  // <--------- 👈
})

export default function Home() {
  return (
    <main className={`${cormorant.variable}`}>
      <Announcement/>
      <Navbar/>
      <Separator/>
      <Body/>
      <Separator/>
      <Footer/>

    </main>
  );
}

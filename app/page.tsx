import { Separator } from "@/components/ui/separator";
import Body from "@/components/Body";
import Announcement from "@/components/Announcement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from"next-auth";

export default async function Home() {
  return (
    <main>
      <Announcement />
      <Navbar />
      <Separator />
      <Body />
      <Separator />
      <Footer />
    </main>
  );
}

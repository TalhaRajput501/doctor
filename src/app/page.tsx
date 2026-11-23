/*
 * Doctor Portfolio — Homepage
 * Composed of Header, all content sections, and mobile actions.
 */

import { Header } from "@/components/features/home/Header";
import { Hero } from "@/components/features/home/Hero";
import { TrustStrip } from "@/components/features/home/TrustStrip";
import { About } from "@/components/features/home/About";
import { Services } from "@/components/features/home/Services";
import { ClinicInfo } from "@/components/features/home/ClinicInfo";
import { Testimonials } from "@/components/features/home/Testimonials";
import { FAQ } from "@/components/features/home/FAQ";
import { BookingCTA } from "@/components/features/home/BookingCTA";
import { Footer } from "@/components/features/home/Footer";
import { MobileActionBar } from "@/components/features/home/MobileActionBar";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-1 flex-col bg-background pb-14 md:pb-0">
        <Header />
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <ClinicInfo />
        <Testimonials />
        <FAQ />
        <BookingCTA />
      </main>
      <Footer />
      {/* <MobileActionBar /> */}
    </>
  );
}
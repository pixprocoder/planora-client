import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pricing } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <main className="space-y-12">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
    </main>
  );
}

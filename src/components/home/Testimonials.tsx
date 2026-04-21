"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "Planora transformed how we handle our annual design summit. The QR check-ins and attendee approval workflow saved us dozens of hours in logistics.",
    author: "Sarah Jenkins",
    role: "Lead Organizer, DesignConf",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    quote: "The visual aesthetic of the platform aligns perfectly with our brand. It's the first time our ticket landing page finally looks as premium as the event itself.",
    author: "Marcello Rossi",
    role: "Founder, LuxeEvents",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcello",
  },
  {
    quote: "Security was our top priority. Planora's encryption for private access codes and ticket validation has made our closed-door sessions much more secure.",
    author: "Dr. Elena Vance",
    role: "Operations Director, Synthia Tech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Trusted by Industry Leaders</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See why the world&apos;s most innovative creators choose Planora to power their experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={test.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 backdrop-blur-sm flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="space-y-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Quote className="w-5 h-5 fill-current" />
                </div>
                <p className="text-lg italic text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 relative">
                  <Image
                    src={test.avatar}
                    alt={test.author}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{test.author}</h4>
                  <p className="text-xs text-muted-foreground">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

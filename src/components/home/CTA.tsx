"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[120px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-24 rounded-[4rem] bg-card border border-border shadow-2xl overflow-hidden text-center space-y-8"
        >
          {/* Internal Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="w-4 h-4 fill-current" />
              Start Your Journey Today
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-tight">
              Ready to Host Your <br /> Next Masterpiece?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Join thousands of organizers creating premium, secure, and unforgettable events on the world&apos;s most innovative platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link
              href="/register"
              className="group relative bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 flex items-center gap-3"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 rounded-2xl font-black text-xl border border-border hover:bg-secondary transition-all"
            >
              Contact Sales
            </Link>
          </div>

          <p className="text-sm text-muted-foreground relative z-10">
            No credit card required to start. 14-day free trial on Pro features.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

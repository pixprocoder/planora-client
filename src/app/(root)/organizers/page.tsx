"use client";

import { motion } from "framer-motion";
import { ShieldCheck, QrCode, Users, Layers, Layout, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrganizersPage() {
  return (
    <main className="py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-xs font-bold uppercase tracking-widest text-primary border border-border">
              Professional Organizer Suite
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none">
              Built for <span className="text-primary italic">Creators</span> of all scales.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you&apos;re hosting a private masterclass or a global festival, our organizer-first architecture gives you total control.
            </p>
            <div className="flex gap-4">
              <Link href="/register" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity">
                Start Hosting
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-linear-to-br from-primary/20 via-primary/5 to-transparent rounded-[4rem] border border-primary/20 p-8 flex items-center justify-center relative group overflow-hidden"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:scale-110 transition-transform duration-[10s]" />
             <Layout className="w-32 h-32 text-primary animate-pulse" />
          </motion.div>
        </div>

        {/* Organizer Specific Features */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight">The Pro Advantage</h2>
            <p className="text-muted-foreground text-lg">Exlusive tools designed to eliminate event-day chaos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Approval Matrix",
                desc: "Filter and approve every attendee manually or via custom eligibility criteria.",
                icon: ShieldCheck,
                color: "text-emerald-400"
              },
              {
                title: "QR Logic",
                desc: "Real-time ticket scanning with instant dashboard synchronization and theft prevention.",
                icon: QrCode,
                color: "text-blue-400"
              },
              {
                title: "Tiered Logistics",
                desc: "Assign different permissions to your team members for check-ins vs. management.",
                icon: Layers,
                color: "text-purple-400"
              },
              {
                title: "Global Discovery",
                desc: "Your events are instantly showcased on our public feed to drive organic growth.",
                icon: Users,
                color: "text-cyan-400"
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all flex flex-col group"
              >
                <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{feature.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                  Documentation <ArrowRight className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

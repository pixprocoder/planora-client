"use client";

import { Navbar } from "@/components/shared/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] -z-10 rounded-full" />

          <div className="max-w-7xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border text-xs font-semibold tracking-wide uppercase text-primary"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              The Future of Event Planning
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1]"
            >
              Plan. Discover. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400 animate-gradient">
                Experience.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              The unified platform for organizing premium events, secure ticketing,
              and seamless attendee experiences. Join thousands of creators today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/events"
                className="group relative bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 flex items-center gap-2"
              >
                Explore Events
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-2xl font-bold text-lg border border-border hover:bg-secondary transition-all"
              >
                View Pricing
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards Group */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Instant Ticketing",
              desc: "Secure, QR-based check-ins for any event type.",
              icon: Zap,
              color: "text-amber-400",
            },
            {
              title: "Organizer Privacy",
              desc: "Manage attendees with 4-way approval matrix.",
              icon: Shield,
              color: "text-primary",
            },
            {
              title: "Global Reach",
              desc: "Host public or private events from anywhere.",
              icon: Globe,
              color: "text-cyan-400",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm group hover:border-primary/50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}

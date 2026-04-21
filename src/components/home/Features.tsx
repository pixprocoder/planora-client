"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe } from "lucide-react";

const features = [
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
];

export function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
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
  );
}

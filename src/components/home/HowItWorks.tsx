"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    title: "Craft Your Event",
    desc: "Design your event with rich details, custom ticketing tiers, and precise privacy settings.",
    icon: CalendarPlus,
    color: "text-blue-400",
  },
  {
    title: "Launch & Distribute",
    desc: "Publish to the public discovery feed or keep it private with secure access codes.",
    icon: Rocket,
    color: "text-purple-400",
  },
  {
    title: "Manage & Scale",
    desc: "Track real-time registrations, manage approvals, and scan QR codes for seamless check-ins.",
    icon: BarChart3,
    color: "text-emerald-400",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">How Planora Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From initial concept to full-scale execution, we provide the tools you need to host unforgettable experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-border to-transparent -translate-y-1/2 hidden md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative bg-background p-8 rounded-[2.5rem] border border-border/50 flex flex-col items-center text-center space-y-6 group hover:border-primary/30 transition-colors z-10 shadow-xl"
            >
              <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
              
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center font-black text-primary text-sm shadow-lg">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

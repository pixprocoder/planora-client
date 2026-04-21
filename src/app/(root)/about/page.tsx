"use client";

import { motion } from "framer-motion";
import { Users, Target, Rocket, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        {/* Story Section */}
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest"
          >
            Our Mission
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight">Redefining Event Management</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Planora was born from a simple observation: event planning is needlessly complex, fragmented, and often lacks the premium experience that attendees deserve. We built Planora to be the single, unified operating system for high-impact events.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Privacy First",
              desc: "From encrypted access codes to private attendee lists, we ensure your event data remains yours.",
              icon: ShieldCheck,
              color: "text-rose-400"
            },
            {
              title: "Experience Led",
              desc: "Every interaction, from the first ticket click to the final check-in, is designed to wow.",
              icon: Rocket,
              color: "text-purple-400"
            },
            {
              title: "User Centric",
              desc: "Tools built for organizers, by people who understand the chaos of event day.",
              icon: Users,
              color: "text-blue-400"
            },
            {
              title: "Goal Oriented",
              desc: "Real-time analytics and approval flows to help you reach your attendance targets.",
              icon: Target,
              color: "text-emerald-400"
            }
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 backdrop-blur-sm space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center">
                <value.icon className={`w-6 h-6 ${value.color}`} />
              </div>
              <h3 className="text-xl font-bold">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-12 rounded-[3.5rem] bg-primary text-primary-foreground text-center space-y-6"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight italic">
            &ldquo;We aren&apos;t just building a ticketing tool; we&apos;re building the future of physical experiences.&rdquo;
          </h2>
          <p className="text-primary-foreground/80 font-bold tracking-widest uppercase text-sm">
            - The Planora Team
          </p>
        </motion.div>
      </div>
    </main>
  );
}

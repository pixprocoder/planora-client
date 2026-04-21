"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "0",
    desc: "For individual creators and small private gatherings.",
    features: [
      "Up to 50 attendees per event",
      "Public & Private event posting",
      "Standard QR Check-ins",
      "Basic Analytics",
    ],
    icon: Zap,
    color: "text-amber-400",
    button: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "49",
    desc: "Everything you need for large-scale premium events.",
    features: [
      "Unlimited attendees",
      "Priority approval matrix",
      "Advanced engagement metrics",
      "Custom branding for tickets",
      "Team collaboration slots",
    ],
    icon: Crown,
    color: "text-primary",
    button: "Go Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Tailored solutions for massive festivals and corporations.",
    features: [
      "Dedicated server instances",
      "White-label platform",
      "API access for ticketing",
      "24/7 dedicated support",
      "Multi-region data residency",
    ],
    icon: Building2,
    color: "text-cyan-400",
    button: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="py-24 px-6 bg-secondary/10 relative overflow-hidden" id="pricing">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-linear-to-t from-background to-transparent -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Simple, Growth-Ready Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your event scaling needs. No hidden fees, just pure premium experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-[3rem] border border-border backdrop-blur-xl flex flex-col h-full bg-card/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group ${
                tier.popular ? "border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/20" : "hover:border-primary/30"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                    <tier.icon className={`w-6 h-6 ${tier.color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-black">
                    {tier.price === "Custom" ? "" : "$"}
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tier.desc}
                </p>

                <div className="h-px bg-border/50" />

                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={tier.price === "Custom" ? "/contact" : "/register"}
                className={`w-full mt-10 py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
                  tier.popular
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {tier.button}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

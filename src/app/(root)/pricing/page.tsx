"use client";

import { Pricing } from "@/components/home/Pricing";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Is there a limit on the number of events I can host?",
    a: "No! Whether you're on the Starter or Pro plan, you can host as many events as you like. The tiers primarily determine the attendee capacity per event and access to advanced management features."
  },
  {
    q: "How do QR check-ins work?",
    a: "Every attendee receives a unique, encrypted QR code via email. As an organizer, you can use the Planora dashboard on any mobile device to scan and validate these codes instantly."
  },
  {
     q: "Can I upgrade or downgrade my plan at any time?",
     a: "Absolutely. You can switch between plans whenever you need. If you upgrade, the new features become available immediately."
  }
];

export default function PricingPage() {
  return (
    <main className="py-20">
      <Pricing />

      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black tracking-tight flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" />
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-secondary/20 border border-border/50"
            >
              <h4 className="text-lg font-bold mb-3">{faq.q}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

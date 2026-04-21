"use client";

import { motion } from "framer-motion";
import { Settings, Lock, Smartphone, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10"
    >
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Account Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account preferences, security settings, and display options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <aside className="space-y-2">
          {[
            { name: "General Settings", icon: Globe },
            { name: "Security & Privacy", icon: Lock },
            { name: "Device Management", icon: Smartphone },
            { name: "Appearance", icon: Palette },
          ].map((item, i) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                i === 0 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="p-8 rounded-[2.5rem] bg-card border border-border/50 space-y-8">
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary">General Configuration</h3>
            
            <div className="space-y-6">
              {[
                { label: "Language", value: "English (US)" },
                { label: "Timezone", value: "(GMT+03:00) Eastern European Time" },
                { label: "Currency", value: "USD ($)" },
              ].map((field) => (
                <div key={field.label} className="flex items-center justify-between py-4 border-b border-border/30 last:border-0">
                  <span className="font-bold">{field.label}</span>
                  <button className="text-sm font-bold text-primary hover:underline">{field.value}</button>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Server, Database, Key } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10"
    >
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Platform Administration
        </h2>
        <p className="text-muted-foreground">
          Configure platform-wide parameters, manage API keys, and monitor system security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: "API Configuration", desc: "Manage endpoints and external keys.", icon: Key },
          { title: "Platform Security", desc: "Global auth rules and login defaults.", icon: Shield },
          { title: "Server Health", desc: "Monitor database and infrastructure status.", icon: Server },
          { title: "Database Backups", desc: "Configure automated snapshots.", icon: Database },
        ].map((item) => (
          <div key={item.title} className="p-8 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <item.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{item.desc}</p>
            <button className="text-sm font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-2">
              Configure
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Calendar, Plus, Search, Filter, ShieldCheck } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Global Event Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Oversee all platform events, monitor attendance, and manage category assignments.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
          Assign Category
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Filter events globally..."
            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-card border border-border/50 focus:border-primary/50 outline-none transition-all"
          />
        </div>
        <button className="p-4 rounded-2xl bg-secondary/50 border border-border/50 flex items-center gap-2 font-medium">
          <Filter className="w-5 h-5 text-muted-foreground" />
          Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all">
            <div className="h-40 rounded-3xl bg-secondary/50 mb-6 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Event {i}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
              Review platform-wide events and manage their visibility status.
            </p>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                Active
              </span>
              <button className="text-xs font-bold uppercase text-primary hover:underline">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

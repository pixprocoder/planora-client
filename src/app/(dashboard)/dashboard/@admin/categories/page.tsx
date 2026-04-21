"use client";

import { motion } from "framer-motion";
import { Layers, Plus, Search, Filter } from "lucide-react";

export default function AdminCategoriesPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Category Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Organize events by creating and managing global categories.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Conferences", "Workshops", "Socials"].map((category) => (
          <div key={category} className="p-8 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all flex items-center justify-between group">
            <div>
              <h3 className="text-xl font-bold">{category}</h3>
              <p className="text-sm text-muted-foreground">12 active events</p>
            </div>
            <button className="p-3 rounded-xl bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { Calendar, Star, Ticket } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { name: "Total Events", value: "0", icon: Calendar, color: "text-primary" },
    { name: "Active Tickets", value: "0", icon: Ticket, color: "text-cyan-400" },
    { name: "Average Rating", value: "4.9", icon: Star, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-10">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black tracking-tight"
          >
            Welcome, {user?.name?.split(" ")[0] || "User"}! 👋
          </motion.h2>
          <p className="text-muted-foreground">
            Manage your booked events and discover new experiences.
          </p>
        </div>

        <Link href="/events">
          <Button className="h-12 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            Explore Events
          </Button>
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm flex items-center gap-5 group hover:border-primary/30 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {stat.name}
              </p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

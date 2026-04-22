"use client";

import { motion } from "framer-motion";
import { Calendar, Star, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export default function UserDashboard() {
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: userService.getMyProfile,
  });

  const user = profileResponse?.data;

  const stats = [
    { name: "Total Events", value: user?._count?.organizedEvents || "0", icon: Calendar, color: "text-primary" },
    { name: "Active Bookings", value: user?._count?.joinRequests || "0", icon: Ticket, color: "text-cyan-400" },
    { name: "Average Rating", value: user?._count?.reviews ? "5.0" : "4.9", icon: Star, color: "text-amber-400" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Synchronizing Your Activity Feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black tracking-tight"
          >
            Welcome, {user?.name?.split(" ")[0] || "User"}! 👋
          </motion.h2>
          <p className="text-muted-foreground font-medium">
            Manage your booked events and discover new experiences.
          </p>
        </div>

        <Link href="/events">
          <button className="h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            Explore Events
          </button>
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm flex items-center gap-6 group hover:border-primary/30 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {stat.name}
              </p>
              <p className="text-2xl font-black mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>
      
      {/* Quick Links / Recent Activity could go here */}
    </div>
  );
}

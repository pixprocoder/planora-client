"use client";

import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertCircle, ShieldCheck, Users, Calendar, ArrowRight, Loader2, DollarSign, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  // 1. Fetch Dynamic Admin Stats
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminService.getDashboardStats,
  });

  const stats = statsResponse?.data;

  const adminStatsCards = [
    { 
      name: "Global Users", 
      value: stats?.totalUsers?.toLocaleString() || "0", 
      icon: Users, 
      color: "text-primary",
      description: "Total registered identities"
    },
    { 
      name: "Total Revenue", 
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-emerald-400",
      description: "Platform-wide COMPLETED fees"
    },
    { 
      name: "Authority Nodes", 
      value: stats?.totalJoinRequests?.toLocaleString() || "0", 
      icon: Activity, 
      color: "text-indigo-400",
      description: "Total platform interactions"
    },
    { 
        name: "Categories", 
        value: stats?.totalCategories?.toLocaleString() || "0", 
        icon: Layers, 
        color: "text-amber-400",
        description: "Active discovery domains"
      },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Synchronizing Authority Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tight flex items-center gap-3 italic uppercase"
          >
            <ShieldCheck className="w-10 h-10 text-primary" />
            Admin Command Center: {user?.name?.split(" ")[0] || "Admin"}
          </motion.h2>
          <p className="text-muted-foreground font-medium">
            Surgical oversight of <span className="text-foreground font-bold">Planora&apos;s</span> system-wide telemetry and activity.
          </p>
        </div>
      </section>

      {/* High-Fidelity Stat Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatsCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-xl shadow-primary/5 flex flex-col gap-6 group hover:border-primary/40 transition-all cursor-default"
          >
            <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-3xl bg-secondary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {stat.name}
                    </p>
                    <p className="text-3xl font-black mt-1">{stat.value}</p>
                </div>
            </div>
            <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground italic">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Recent Activity & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events Feed */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black italic uppercase flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Mission-Critical Events
                </h3>
                <Link href="/dashboard/events" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    Manage All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {stats?.recentEvents.map((event, i) => (
                        <motion.div 
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-3xl bg-card border border-border/50 flex items-center justify-between group hover:bg-primary/2 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary overflow-hidden relative shadow-inner">
                                    {event.image ? (
                                        <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary/30">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-black text-sm">{event.title}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">
                                        {new Date(event.date).toLocaleDateString()} &bull; {event.venue}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-4">
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Revenue</p>
                                    <p className="text-sm font-black text-emerald-500">${event.fee || 0}</p>
                                </div>
                                <div className="w-px h-8 bg-border/50" />
                                <Link 
                                    href={`/events/${event.id}`}
                                    className="p-2 rounded-xl bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
          </section>

          {/* Quick Stats Panel */}
          <section className="space-y-6">
              <h3 className="text-xl font-black italic uppercase flex items-center gap-2 px-2">
                  <Activity className="w-5 h-5 text-primary" />
                  System Health
              </h3>
              <div className="p-8 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/20 space-y-6">
                  <div className="space-y-2">
                      <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black uppercase text-indigo-500">Node Synchronization</p>
                          <p className="text-xs font-black">98.4%</p>
                      </div>
                      <div className="w-full h-2 bg-indigo-500/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "98.4%" }}
                            className="h-full bg-indigo-500" 
                          />
                      </div>
                  </div>
                  
                  <div className="p-6 rounded-3xl bg-white dark:bg-black/20 border border-indigo-500/10 space-y-4 shadow-xl shadow-indigo-500/5">
                      <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                          <p className="text-xs font-bold">Pending Approval Queue</p>
                      </div>
                      <p className="text-2xl font-black text-center">{stats?.totalJoinRequests || 0}</p>
                      <button className="w-full py-3 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
                          Process Requests
                      </button>
                  </div>

                  <p className="text-[10px] text-muted-foreground italic text-center">
                    All telemetry is surgicaly synchronized with the Planora Authority Node.
                  </p>
              </div>
          </section>
      </div>
    </div>
  );
}

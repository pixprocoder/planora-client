"use client";

import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { Activity, AlertCircle, ShieldCheck, Users } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const adminStats = [
    { name: "Global Users", value: "1,280", icon: Users, color: "text-primary" },
    { name: "Total Revenue", value: "$42.5k", icon: Activity, color: "text-emerald-400" },
    { name: "Pending Approvals", value: "12", icon: AlertCircle, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-10">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black tracking-tight flex items-center gap-3"
          >
            <ShieldCheck className="w-8 h-8 text-primary" />
            Admin Command Center
          </motion.h2>
          <p className="text-muted-foreground">
            Monitor system-wide activity and manage event curator requests.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminStats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm flex items-center gap-6 group hover:border-primary/40 transition-all cursor-default"
          >
            <div className="w-14 h-14 rounded-3xl bg-secondary flex items-center justify-center">
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {stat.name}
              </p>
              <p className="text-3xl font-black mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Admin Quick View Placeholder */}
      <section className="h-[300px] rounded-[3rem] bg-secondary/30 border border-border/50 flex items-center justify-center">
        <p className="text-muted-foreground italic">System analytics and approval queue loading...</p>
      </section>
    </div>
  );
}

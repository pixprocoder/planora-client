"use client";

import { motion } from "framer-motion";
import { Bell, ShieldAlert, Activity, CheckCircle } from "lucide-react";

export default function AdminNotificationsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-primary" />
            System Activity Feed
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor global alerts, system health, and administrative task queues.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Critical Alerts", value: "0", color: "text-rose-500", icon: ShieldAlert },
          { label: "Active Users", value: "1,240", color: "text-primary", icon: Activity },
          { label: "Tasks Cleared", value: "98%", color: "text-emerald-500", icon: CheckCircle },
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-4xl bg-card border border-border/50">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-4xl bg-card border border-border/50 flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300"
          >
            <div className="w-12 h-12 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Global System Alert {i}</h3>
              <p className="text-sm text-muted-foreground">Detailed logs of administrative actions or system warnings...</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

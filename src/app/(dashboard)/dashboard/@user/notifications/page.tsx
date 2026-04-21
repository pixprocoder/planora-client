"use client";

import { useSession } from "@/lib/auth-client";
import { ISession } from "@/types";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function NotificationsPage() {
  const sessionData = useSession();
  const session = sessionData.data as ISession | null;
  const role = session?.user.role?.toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Activity Center
          </h2>
          <p className="text-muted-foreground mt-1">
            {role === "ADMIN" 
              ? "Monitor system-wide alerts and pending administration tasks." 
              : "Updates on your event registrations and profile status."}
          </p>
        </div>
        <button className="text-sm font-bold text-primary hover:underline uppercase tracking-widest">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {[
          { title: "System Update", type: "system", time: "2 hours ago", icon: Clock },
          { title: "Join Request Approved", type: "user", time: "5 hours ago", icon: CheckCircle },
          { title: "Security Alert", type: "system", time: "1 day ago", icon: AlertTriangle },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex-1 bg-card border border-border/50 rounded-4xl p-6 md:p-8 flex items-start gap-4 transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              item.type === "system" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
            }`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">Notification details would appear here fetched from the server...</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

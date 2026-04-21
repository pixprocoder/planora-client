"use client";

import { motion } from "framer-motion";
import { Users, Search, MoreVertical, Shield } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            User Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor accounts, manage roles, and review user status.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-card border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/30">
                <th className="pb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</th>
                <th className="pb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="pb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="pb-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="group hover:bg-secondary/20 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        U
                      </div>
                      <div>
                        <p className="font-bold">Test User {i}</p>
                        <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="px-3 py-1 rounded-full bg-secondary text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      User
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, MoreVertical, Shield, Loader2, UserCheck, UserX, Search, Mail, Phone } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { confirmAction } from "@/utils/confirmModal";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch All Users
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminService.getAllUsers
  });

  const users = usersResponse?.data || [];

  // 2. Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "ACTIVE" | "BANNED" }) => 
      adminService.updateUserStatus(userId, status),
    onSuccess: (data) => {
      toast.success(`User status updated to ${data.data.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    }
  });

  const handleStatusChange = async (userId: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    const confirmed = await confirmAction(
      "Confirm Authority Action",
      `Are you sure you want to ${newStatus === "BANNED" ? "surgicaly restrict" : "restore access for"} ${name}?`
    );
    if (confirmed) {
      updateStatusMutation.mutate({ userId, status: newStatus });
    }
  };

  // 3. Filtered Users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Synchronizing User Directory...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic uppercase">
            <Users className="w-8 h-8 text-primary" />
            User Management
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Monitor <span className="text-foreground font-bold">{users.length}</span> registered accounts across the platform.
          </p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border/50 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
        </div>
      </div>

      {/* Main Directory Table */}
      <div className="rounded-[2.5rem] bg-card border border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Clearance</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={user.id} 
                    className="group hover:bg-primary/2 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner relative overflow-hidden">
                          {user.image ? (
                            <Image 
                              src={user.image} 
                              alt={user.name} 
                              fill 
                              className="object-cover" 
                              unoptimized 
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-black text-foreground">{user.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                             <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                               <Mail className="w-3 h-3" />
                               {user.email}
                             </p>
                             {user.phone && (
                               <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                 <Phone className="w-3 h-3" />
                                 {user.phone}
                               </p>
                             )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={ `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === "ADMIN" 
                          ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" 
                          : "bg-secondary text-muted-foreground"
                      }` }>
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shadow-sm ${
                          user.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        }`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${
                          user.status === "ACTIVE" ? "text-emerald-500" : "text-rose-500"
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleStatusChange(user.id, user.status, user.name)}
                          disabled={updateStatusMutation.isPending}
                          className={`p-2.5 rounded-xl transition-all shadow-sm ${
                            user.status === "ACTIVE" 
                              ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" 
                              : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          }`}
                          title={user.status === "ACTIVE" ? "Ban User" : "Activate User"}
                        >
                          {user.status === "ACTIVE" ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                        </button>
                        <button className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:bg-foreground hover:text-background transition-all shadow-sm">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 rounded-4xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
              <Search className="w-10 h-10" />
            </div>
            <p className="text-muted-foreground font-medium italic">No users found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

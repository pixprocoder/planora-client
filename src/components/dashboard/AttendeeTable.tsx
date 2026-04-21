"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  User as UserIcon, 
  Mail, 
  Clock, 
  ShieldAlert,
  Search,
  Filter
} from "lucide-react";
import { joinRequestService } from "@/services/joinRequest.service";
import { IJoinRequest } from "@/types/join-request.types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AttendeeTableProps {
  eventId: string;
  requests: IJoinRequest[];
}

export function AttendeeTable({ eventId, requests }: AttendeeTableProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const statusMutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: "APPROVED" | "REJECTED" }) =>
      joinRequestService.updateRequestStatus(requestId, { status }),
    onSuccess: () => {
      toast.success("Request synchronized successfully.");
      queryClient.invalidateQueries({ queryKey: ["event-requests", eventId] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || "Failed to update request";
      toast.error(message);
    }
  });

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === "ALL" || req.status === filter;
    const matchesSearch = !search || 
      req.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      req.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Table Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b border-border/50">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm font-medium transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-secondary/30 border border-border/50 rounded-2xl">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left px-4">
              <th className="pb-4 pl-6">Node / Attendee</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right pr-6">Action Matrix</th>
            </tr>
          </thead>
          <tbody className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((req) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={req.id}
                  className="bg-card/40 border border-border/50 rounded-3xl group hover:border-primary/30 transition-all shadow-sm"
                >
                  <td className="py-5 pl-6 rounded-l-[1.5rem] border-y border-l border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground overflow-hidden">
                        {req.user?.image ? (
                           <img src={req.user.image} alt={req.user.name} className="w-full h-full object-cover" />
                        ) : (
                           <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black italic uppercase tracking-tight">{req.user?.name}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                          <Mail className="w-3 h-3" />
                          {req.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-5 border-y border-border/50">
                    <div className="flex items-center gap-2">
                       {req.status === "PENDING" && <Clock className="w-4 h-4 text-amber-500 animate-pulse" />}
                       {req.status === "APPROVED" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                       {req.status === "REJECTED" && <XCircle className="w-4 h-4 text-rose-500" />}
                       <span className={`text-[10px] font-black uppercase tracking-widest ${
                         req.status === "APPROVED" ? "text-emerald-500" : 
                         req.status === "REJECTED" ? "text-rose-500" : "text-amber-500"
                       }`}>
                         {req.status}
                       </span>
                    </div>
                  </td>

                  <td className="py-5 pr-6 text-right rounded-r-[1.5rem] border-y border-r border-border/50">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() => statusMutation.mutate({ requestId: req.id, status: "APPROVED" })}
                            disabled={statusMutation.isPending}
                            className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => statusMutation.mutate({ requestId: req.id, status: "REJECTED" })}
                            disabled={statusMutation.isPending}
                            className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" />
                          Matrix Locked
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="py-32 text-center space-y-4 bg-secondary/10 rounded-4xl border border-dashed border-border/50">
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">No matching attendees located in node</p>
          </div>
        )}
      </div>
    </div>
  );
}

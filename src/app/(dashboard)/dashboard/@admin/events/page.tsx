"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MoreVertical, Search, Loader2, Trash2, ExternalLink, ShieldCheck, MapPin, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { eventService } from "@/services/event.service";
import { confirmAction } from "@/utils/confirmModal";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch All Events (Unfiltered for Admin)
  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ["admin", "events"],
    queryFn: adminService.getAllEvents
  });

  const events = eventsResponse?.data || [];

  // 2. Delete Event Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      toast.success("Event surgicaly removed from platform");
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
    onError: () => {
      toast.error("Failed to moderate event");
    }
  });

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction(
      "Confirm Deletion",
      "Are you sure you want to surgicaly delete this event? This cannot be undone."
    );
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  // 3. Filtered Events
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.organizer?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Synchronizing Global Event Catalog...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic uppercase">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Global Event Feed
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Oversight of <span className="text-foreground font-bold">{events.length}</span> active and unlisted events.
          </p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search events or organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border/50 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
        </div>
      </div>

      {/* Events Directory */}
      <div className="rounded-[2.5rem] bg-card border border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Event Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Organizer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Metrics</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={event.id} 
                    className="group hover:bg-primary/2 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-secondary overflow-hidden relative shadow-inner">
                          {event.image ? (
                            <Image 
                              src={event.image} 
                              alt={event.title} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform" 
                              unoptimized 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/40">
                              <Calendar className="w-8 h-8" />
                            </div>
                          )}
                          <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                            event.visibility === "PUBLIC" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                          }`}>
                            {event.visibility}
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-foreground text-lg leading-tight">{event.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                             <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-black uppercase tracking-widest">
                               <Calendar className="w-3 h-3" />
                               {new Date(event.date).toLocaleDateString()}
                             </p>
                             <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-black uppercase tracking-widest border-l border-border pl-3">
                               <MapPin className="w-3 h-3" />
                               {event.venue}
                             </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-xs font-bold uppercase">
                          {event.organizer?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                           <p className="text-sm font-black text-foreground">{event.organizer?.name || "Unknown"}</p>
                           <p className="text-[10px] text-muted-foreground font-medium">{event.organizer?.email || "No Email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="text-center px-4 py-2 bg-secondary/50 rounded-xl">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Approved</p>
                          <p className="text-lg font-black text-primary">{event._count?.requests || 0}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {event.capacity} Capacity
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/events/${event.id}`}
                          target="_blank"
                          className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="View Public Link"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-rose-500/20"
                          title="Moderate (Delete)"
                        >
                          <Trash2 className="w-5 h-5" />
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
        
        {filteredEvents.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 rounded-4xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
              <Calendar className="w-10 h-10" />
            </div>
            <p className="text-muted-foreground font-medium italic">No events found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

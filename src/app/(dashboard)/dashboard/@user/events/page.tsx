'use client'
import { useSession } from "@/lib/auth-client";
import { eventService } from "@/services/event.service";
import { ISession } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Search,
  Ticket,
  Clock,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { formatDate, formatTime } from "@/utils/date";
import Link from "next/link";
import { useState } from "react";

export default function EventsPage() {
  const sessionData = useSession();
  const session = sessionData.data as ISession | null;
  const role = session?.user.role?.toUpperCase();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: eventService.getMyEvents,
  });

  const events = data?.data || [];
  
  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic uppercase">
            <Calendar className="w-8 h-8 text-primary" />
            {role === "ADMIN" ? "Global Experience Hub" : "My Organized Events"}
          </h2>
          <p className="text-muted-foreground mt-1 font-medium italic">
            {role === "ADMIN"
              ? "Oversee all platform activity and manage category assignments."
              : "Keep track of your upcoming events and manage attendee join requests."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role === "ADMIN" && (
            <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-border/50 hover:bg-secondary/80 transition-all">
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          )}
          <Link
            href="/dashboard/events/create"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Launch Event
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4 bg-card/40 p-4 rounded-3xl border border-border/40 backdrop-blur-sm">
        <div className="flex-1 min-w-[300px] relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background transition-all outline-none text-sm font-bold"
          />
        </div>
        <button className="p-4 rounded-2xl bg-secondary/50 border border-border/50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4 text-muted-foreground" />
          Refine Nodes
        </button>
      </div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[400px] flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-black italic uppercase text-[10px] tracking-widest animate-pulse">Syncing events node...</p>
          </motion.div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all relative overflow-hidden flex flex-col h-full shadow-xl shadow-primary/5"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[60px] -z-10 group-hover:bg-primary/10 transition-all duration-500" />

                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest italic">
                      {event.category?.name || "Uncategorized"}
                    </div>
                    {event._count && event._count.requests > 0 && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-rose-500/20"
                      >
                        <ShieldAlert className="w-3 h-3 animate-pulse" />
                        {event._count.requests} Pending
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-black mb-2 line-clamp-1 italic uppercase tracking-tighter group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-3 pb-6 border-b border-border/30">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-muted-foreground/70 tracking-widest">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-muted-foreground/70 tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {formatDate(event.date)} @ {formatTime(event.time)}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-muted-foreground/70 tracking-widest">
                      <Ticket className="w-3.5 h-3.5 text-primary" />
                      {event.fee === 0 ? "Free Access" : `$${event.fee}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-auto">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Visibility</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-colors ${
                      event.visibility === "PUBLIC" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      {event.visibility}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/events/${event.id}`}
                    className="flex items-center gap-2 text-xs font-black italic uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-xl group/link hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    Manage Matrix
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-secondary/10 rounded-4xl border border-dashed border-border"
          >
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter">No Experience Nodes Located</h3>
            <p className="text-muted-foreground mt-2 max-w-sm font-medium">
              It looks like you haven&apos;t launched or registered for any events yet.
            </p>
            <Link
              href="/dashboard/events/create"
              className="mt-10 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Launch Core Experience
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

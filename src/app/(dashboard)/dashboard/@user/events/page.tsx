'use client'
import { useSession } from "@/lib/auth-client";
import { eventService } from "@/services/event.service";
import { ISession } from "@/types";
import { formatDate, formatTime } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Ticket,
  Users as UsersIcon
} from "lucide-react";
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
      className="space-y-12 pb-24"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
        <div>
          <h2 className="text-4xl font-black tracking-tight flex items-center gap-4 italic uppercase text-primary">
            <Calendar className="w-10 h-10" />
            {role === "ADMIN" ? "Experience Hub" : "My Events"}
          </h2>
          <p className="text-muted-foreground mt-2 font-medium italic max-w-lg">
            {role === "ADMIN"
              ? "Oversee platform activity and manage discovery domains."
              : "Monitor your upcoming nodes and moderate platform interactions."}
          </p>
        </div>

        <Link
          href="/dashboard/events/create"
          className="flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-fit"
        >
          <Plus className="w-5 h-5" />
          Launch Event
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-6 bg-card/40 p-6 rounded-[3rem] border border-border/40 backdrop-blur-md mx-2">
        <div className="flex-1 min-w-[300px] relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search discovery nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background transition-all outline-none text-sm font-bold tracking-tight"
          />
        </div>
        <button className="px-8 py-5 rounded-[2rem] bg-secondary/50 border border-border/50 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
          <Filter className="w-4 h-4 text-muted-foreground" />
          Refine Feed
        </button>
      </div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-black italic uppercase text-xs tracking-[0.2em] animate-pulse">Syncing matrix...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2"
          >
            {filteredEvents.map((event: any) => (
              <motion.div
                layout
                key={event.id}
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[4rem] bg-card border border-border/50 hover:border-primary/40 transition-all relative overflow-hidden flex flex-col h-full shadow-2xl shadow-primary/5"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10 group-hover:bg-primary/10 transition-all duration-700" />

                {/* Top Section: Icon & Tags */}
                <div className="flex items-center justify-between mb-10">
                  <div className="w-16 h-16 rounded-[1.75rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/5">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest italic">
                      {event.category?.name || "Global"}
                    </span>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                        <UsersIcon className="w-3 h-3" />
                        {event.requests?.length || 0}
                      </div>
                      {event._count?.requests > 0 && (
                        <div className="px-3 py-1.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-rose-500/20">
                          <ShieldAlert className="w-3 h-3 animate-pulse" />
                          {event._count.requests}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Content */}
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-black leading-tight italic uppercase tracking-tighter group-hover:text-primary transition-colors pr-4">
                    {event.title}
                  </h3>

                  <div className="space-y-4 py-8 border-y border-border/30">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-muted-foreground/80 tracking-widest">
                      <MapPin className="w-4 h-4 text-primary opacity-70" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-muted-foreground/80 tracking-widest">
                      <Clock className="w-4 h-4 text-primary opacity-70" />
                      {formatDate(event.date)} @ {formatTime(event.time)}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-muted-foreground/80 tracking-widest">
                      <Ticket className="w-4 h-4 text-primary opacity-70" />
                      {event.fee === 0 ? "Free Access" : `$${event.fee}`}
                    </div>
                  </div>
                </div>

                {/* Bottom: Actions */}
                <div className="flex items-center justify-between pt-10 mt-auto">
                  <div className="flex flex-col gap-2">
                    <span className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-1">Authority</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${event.visibility === "PUBLIC"
                      ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                      : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                      }`}>
                      {event.visibility}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/events/${event.id}`}
                    className="flex items-center gap-3 text-xs font-black italic uppercase tracking-widest text-primary bg-primary/5 px-8 py-4 rounded-2xl group/link hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5 active:scale-95 border border-primary/10"
                  >
                    Manage
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[500px] flex flex-col items-center justify-center text-center p-24 bg-secondary/5 rounded-[5rem] border-2 border-dashed border-border/40 mx-2"
          >
            <div className="w-40 h-40 rounded-[3rem] bg-secondary/50 flex items-center justify-center mb-10 shadow-inner">
              <Calendar className="w-20 h-20 text-muted-foreground/20" />
            </div>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">No Active Nodes</h3>
            <p className="text-muted-foreground mt-4 max-w-md font-medium italic leading-relaxed">
              Your discovery matrix is currently empty. Deploy a new experience node to begin platform propagation.
            </p>
            <Link
              href="/dashboard/events/create"
              className="mt-14 bg-primary text-primary-foreground px-12 py-6 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Launch New Experience
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

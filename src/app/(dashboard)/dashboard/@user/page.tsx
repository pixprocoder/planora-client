"use client";

import { motion } from "framer-motion";
import { 
    Calendar, 
    Star, 
    Ticket, 
    Loader2, 
    Plus, 
    ArrowRight, 
    TrendingUp, 
    Users,
    ChevronRight,
    UserCircle2
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { eventService } from "@/services/event.service";
import { joinRequestService } from "@/services/joinRequest.service";
import { formatDate, formatTime } from "@/utils/date";

export default function UserDashboard() {
  // 1. Fetch High-Fidelity Profile Stats
  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["me"],
    queryFn: userService.getMyProfile,
  });

  // 2. Fetch Organized Events Trajectory
  const { data: eventsResponse, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["my-events"],
    queryFn: eventService.getMyEvents,
  });

  // 3. Fetch Recent Join Requests (Organizer Feed)
  const { data: requestsResponse, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["all-organizer-requests"],
    queryFn: joinRequestService.getOrganizerAllRequests,
  });

  const user = profileResponse?.data;
  const events = eventsResponse?.data || [];
  const requests = requestsResponse?.data || [];
  
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const stats = [
    { 
        name: "Organized Nodes", 
        value: user?._count?.organizedEvents || "0", 
        icon: Calendar, 
        color: "text-primary",
    },
    { 
        name: "Active Bookings", 
        value: user?._count?.joinRequests || "0", 
        icon: Ticket, 
        color: "text-cyan-400",
    },
    { 
        name: "Platform Merit", 
        value: user?._count?.reviews ? "5.0" : "4.9", 
        icon: Star, 
        color: "text-amber-400",
    },
  ];

  if (isLoadingProfile || isLoadingEvents || isLoadingRequests) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-black italic uppercase text-xs tracking-[0.2em]">Syncing Feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Simplified Header Hub */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2 pt-4">
        <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight italic uppercase">
                Event <span className="text-primary italic">Overview</span>
            </h2>
            <p className="text-muted-foreground font-medium italic tracking-tight">
                Live telemetry from your discovery nodes and participant matrix.
            </p>
        </div>

        <Link href="/dashboard/events/create">
            <button className="h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                <Plus className="w-5 h-5" />
                Launch New Experience
            </button>
        </Link>
      </section>

      {/* 2. Telemetry Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[3rem] bg-card border border-border/50 shadow-2xl shadow-primary/5 flex items-center gap-8 group hover:border-primary/40 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 group-hover:bg-primary/10 transition-all" />
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform border border-border/50">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                {stat.name}
              </p>
              <p className="text-4xl font-black italic tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-2">
        {/* 3. Recent Join Requests Hub */}
        <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    Recent Join Requests
                </h3>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest italic">
                    Live Feed
                </span>
            </div>

            <div className="bg-card border border-border/50 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-primary/5">
                <div className="divide-y divide-border/30">
                    {requests.length > 0 ? (
                        requests.map((request: any, i: number) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-8 hover:bg-secondary/30 transition-all group flex items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center overflow-hidden">
                                        {request.user?.image ? (
                                            <img src={request.user.image} alt={request.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle2 className="w-8 h-8 text-muted-foreground/30" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black italic uppercase tracking-tight">{request.user?.name}</p>
                                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                                request.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                                                request.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                                                "bg-rose-500/10 text-rose-500"
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                                            Requesting for: <span className="text-primary">{request.event?.title}</span>
                                        </p>
                                    </div>
                                </div>
                                
                                <Link href={`/dashboard/events/${request.eventId}`}>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group/btn">
                                        Moderate
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-20 flex flex-col items-center justify-center text-center opacity-60">
                            <Users className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No recent participant activity</p>
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* 4. Upcoming Trajectory Feed */}
        <section className="space-y-8">
            <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Upcoming Nodes
                </h3>
            </div>

            <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="p-6 rounded-[2.5rem] bg-card border border-border/50 shadow-xl shadow-primary/5 flex items-center gap-6 group hover:border-primary/40 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary font-black italic leading-none border border-primary/10">
                                <span className="text-[9px] uppercase tracking-tighter">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-lg">{new Date(event.date).getDate()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black italic uppercase tracking-tight group-hover:text-primary transition-colors truncate">{event.title}</h4>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">{formatTime(event.time)} @ {event.venue}</p>
                            </div>
                            <Link href={`/dashboard/events/${event.id}`}>
                                <button className="p-3 rounded-xl bg-secondary border border-border/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-14 rounded-[3rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-center opacity-60">
                        <Calendar className="w-10 h-10 text-muted-foreground mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trajectory Clear</p>
                    </div>
                )}
            </div>

            <div className="p-8 rounded-[3rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] -z-10 group-hover:bg-primary/20 transition-all" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 italic">Quick Link</h4>
                <p className="text-sm font-bold italic mb-4 opacity-70">Need to explore more discovery nodes?</p>
                <Link href="/events">
                    <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Browse Platform feed
                    </button>
                </Link>
            </div>
        </section>
      </div>
    </div>
  );
}

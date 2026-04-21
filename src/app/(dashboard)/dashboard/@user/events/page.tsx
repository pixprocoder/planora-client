'use client'
import { useSession } from "@/lib/auth-client";
import { eventService } from "@/services/event.service";
import { ISession } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Search,
  Ticket
} from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const sessionData = useSession();
  const session = sessionData.data as ISession | null;
  const role = session?.user.role?.toUpperCase();

  const { data, isLoading } = useQuery({
    queryKey: ["my-events"],
    queryFn: eventService.getMyEvents,
  });

  const events = data?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            {role === "ADMIN" ? "Global Event Management" : "My Events"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {role === "ADMIN"
              ? "Oversee all platform activity and manage category assignments."
              : "Keep track of your upcoming events and manage your bookings."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role === "ADMIN" && (
            <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-2xl font-bold border border-border/50 hover:bg-secondary/80 transition-all">
              <Plus className="w-5 h-5" />
              Category
            </button>
          )}
          <Link
            href="/dashboard/events/create"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-card border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
        <button className="p-4 rounded-2xl bg-secondary/50 border border-border/50 flex items-center gap-2 font-medium hover:bg-secondary transition-colors">
          <Filter className="w-5 h-5 text-muted-foreground" />
          Filter
        </button>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Fetching your events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -5 }}
              className="group p-6 rounded-4xl bg-card border border-border/50 hover:border-primary/40 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 group-hover:bg-primary/10 transition-all" />

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                  {event.category?.name || "Uncategorized"}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ticket className="w-4 h-4" />
                  {event.fee === 0 ? "Free Admission" : `$${event.fee}`}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {event.visibility}
                </span>
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Manage
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-secondary/20 rounded-4xl border border-dashed border-border">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold italic">No Events Found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            It looks like you haven&apos;t created or registered for any events yet.
          </p>
          <Link
            href="/dashboard/events/create"
            className="mt-8 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Launch Your First Event
          </Link>
        </div>
      )}
    </motion.div>
  );
}

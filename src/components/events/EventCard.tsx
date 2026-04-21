"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Clock, ShieldCheck, CheckCircle2, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IEvent } from "@/types/event.types";
import { formatDate, formatTime } from "@/utils/date";
import { JoinRequestStatus } from "@/types/join-request.types";

interface EventCardProps {
  event: IEvent;
  priority?: boolean;
  status?: JoinRequestStatus;
}

export function EventCard({
  event,
  priority = false,
  status,
}: EventCardProps) {
  
  // Status Badge Logic
  const getStatusConfig = (status: JoinRequestStatus) => {
    switch (status) {
      case "APPROVED":
        return { 
          icon: <CheckCircle2 className="w-3 h-3" />, 
          label: "Joined", 
          className: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" 
        };
      case "PENDING":
        return { 
          icon: <Timer className="w-3 h-3" />, 
          label: "Pending", 
          className: "bg-amber-500/20 text-amber-500 border-amber-500/30" 
        };
      case "REJECTED":
        return { 
          icon: <ShieldCheck className="w-3 h-3" />, 
          label: "Rejected", 
          className: "bg-rose-500/20 text-rose-500 border-rose-500/30" 
        };
      default:
        return null;
    }
  };

  const statusConfig = status ? getStatusConfig(status) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 flex flex-col h-full relative"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-secondary/50 flex items-center justify-center text-muted-foreground italic text-xs">
            No Event Image
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-60" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <div className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-widest text-primary">
            {event.category?.name || "Uncategorized"}
          </div>
          
          <AnimatePresence>
            {statusConfig && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`px-3 py-1 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${statusConfig.className}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-lg">
          {event.fee === 0 ? "FREE" : `$${event.fee}`}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors line-clamp-1 uppercase italic">
            {event.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed font-medium">
            {event.description}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              <Calendar className="w-3 h-3 text-primary" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              <Clock className="w-3 h-3 text-primary" />
              {formatTime(event.time)}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {event._count?.requests || 0} Joined
              </span>
            </div>
            <Link
              href={`/events/${event.id}`}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group/link hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
            >
              Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

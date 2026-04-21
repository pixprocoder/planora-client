"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  Clock,
  Info,
  MapPin,
  Share2,
  ShieldCheck,
  Users,
  Loader2,
  Sparkles as SparklesIcon,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/services/event.service";
import { joinRequestService } from "@/services/joinRequest.service";
import { formatDate, formatTime } from "@/utils/date";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = authClient.useSession();

  // 1. Fetch Dynamic Event Data
  const { data: eventResponse, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEventById(id as string),
    enabled: !!id,
  });
  const event = eventResponse?.data;

  // 2. Fetch User's Join Requests to check if already requested
  const { data: myRequestsResponse } = useQuery({
    queryKey: ["my-join-requests"],
    queryFn: joinRequestService.getMyRequests,
    enabled: !!session,
  });
  const hasRequested = myRequestsResponse?.data?.some(req => req.eventId === id);
  const myRequest = myRequestsResponse?.data?.find(req => req.eventId === id);

  // 3. Mutation for Joining Event
  const joinMutation = useMutation({
    mutationFn: () => joinRequestService.createJoinRequest({ eventId: id as string }),
    onSuccess: () => {
      toast.success("Join request sent! The organizer will review it.");
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message || "Failed to send join request";
      toast.error(message);
    }
  });

  const handleJoinClick = () => {
    if (!session) {
      toast.info("Please sign in to join this event");
      router.push("/login");
      return;
    }
    joinMutation.mutate();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Synchronizing Event Reality...</p>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
          <Info className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold italic uppercase tracking-tighter">Event Not Found</h1>
          <p className="text-muted-foreground">The experience you are looking for doesn&apos;t exist or has been removed from the Planora Feed.</p>
        </div>
        <Link href="/events" className="text-primary font-black uppercase tracking-widest hover:underline flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          Discovery Feed
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-32 bg-linear-to-b from-background to-secondary/5">
      {/* Sticky Top Bar (Desktop) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border py-4 px-6 hidden md:block"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                {event.image && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-border">
                    <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">{event.title}</h3>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">{formatDate(event.date)}</p>
                </div>
              </div>
              <button 
                onClick={handleJoinClick}
                disabled={hasRequested || joinMutation.isPending}
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {joinMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                 hasRequested ? `Status: ${myRequest?.status}` : `Secure Spot - $${event.fee}`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground italic">
            No Event Imagery
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />

        {/* Navigation Overlays */}
        <div className="absolute top-8 left-8">
          <button
            onClick={() => router.back()}
            className="p-4 rounded-2xl bg-background/20 backdrop-blur-md border border-white/10 text-white hover:bg-background/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-8 right-8">
          <button className="p-4 rounded-2xl bg-background/20 backdrop-blur-md border border-white/10 text-white hover:bg-background/40 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-12 left-0 w-full px-8">
          <div className="max-w-7xl mx-auto space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary"
              >
                <SparklesIcon className="w-3 h-3 fill-current" />
                {event.category?.name || "Uncategorized"}
              </motion.div>
              {event.visibility === "PRIVATE" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-[10px] font-black uppercase tracking-widest text-rose-500"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Private Access
                </motion.div>
              )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none max-w-4xl uppercase italic"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            <div className="p-8 md:p-12 rounded-[3.5rem] bg-card/60 backdrop-blur-2xl border border-border shadow-2xl space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Schedule</span>
                  </div>
                  <p className="text-xl font-black leading-none">{formatDate(event.date)}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Window</span>
                  </div>
                  <p className="text-xl font-black leading-none">{formatTime(event.time)}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Venue</span>
                  </div>
                  <p className="text-xl font-black leading-none truncate">{event.venue}</p>
                </div>
              </div>

              <div className="h-px bg-border/50" />

              <div className="space-y-6">
                <h2 className="text-3xl font-black tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-4">Experience Intel</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-lg font-medium">
                  <p>{event.description}</p>
                  <p className="mt-4">
                    Join us at <strong>{event.venue}</strong> for an unforgettable session.
                    This event is strictly monitored via our 4-way approval matrix to ensure the highest
                    standard of safety and engagement for all attendees.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/50 border border-border text-[10px] font-black uppercase tracking-widest">
                  <Users className="w-4 h-4 text-primary" />
                  Live Feed Status
                </div>
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Event
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl sticky top-32 space-y-8">
              <div className="space-y-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronized Access</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-black tracking-tighter">${event.fee}</span>
                  <span className="text-muted-foreground font-bold italic tracking-tight">/ node</span>
                </div>
              </div>

              <div className="space-y-4">
                {hasRequested ? (
                  <div className="w-full py-5 bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-500 rounded-2xl font-black text-center flex items-center justify-center gap-2 uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5" />
                    Request {myRequest?.status}
                  </div>
                ) : (
                  <button 
                    onClick={handleJoinClick}
                    disabled={joinMutation.isPending}
                    className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {joinMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 
                     event.visibility === "PRIVATE" ? "Request Access" : "Secure Access"}
                  </button>
                 )}
                <p className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                   Planora Authenticated Discovery
                </p>
              </div>

              <div className="h-px bg-border/50" />

              <div className="space-y-4">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Node Authority</h4>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black uppercase text-xs">
                    {event.organizerId?.substring(0, 2) || "PL"}
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight uppercase line-clamp-1 italic">Event Organizer</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Verified Creator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

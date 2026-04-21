"use client";

import { MOCK_EVENTS } from "@/constants/mock-events";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  Clock,
  Info,
  MapPin,
  Share2,
  ShieldCheck,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const event = MOCK_EVENTS.find((e) => e.id === id);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
          <Info className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Event Not Found</h1>
          <p className="text-muted-foreground">The event you are looking for doesn&apos;t exist or has been removed.</p>
        </div>
        <Link href="/events" className="text-primary font-bold hover:underline flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          Back to Discovery
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-32">
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
                <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-border">
                  <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{event.title}</h3>
                  <p className="text-xs text-primary font-bold">{event.date}</p>
                </div>
              </div>
              <button className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Join Event - ${event.price}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          className="object-cover"
          unoptimized
        />
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-xs font-black uppercase tracking-widest text-primary"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              {event.category}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white tracking-tight leading-none max-w-4xl"
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
            <div className="p-8 md:p-12 rounded-[3.5rem] bg-card border border-border shadow-2xl space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <CalendarDays className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Date</span>
                  </div>
                  <p className="text-xl font-bold">{event.date}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Time</span>
                  </div>
                  <p className="text-xl font-bold">{event.time || "TBA"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Location</span>
                  </div>
                  <p className="text-xl font-bold">{event.location}</p>
                </div>
              </div>

              <div className="h-px bg-border/50" />

              <div className="space-y-6">
                <h2 className="text-3xl font-black tracking-tight">About this Experience</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-lg">
                  <p>{event.longDescription || event.description}</p>
                  <p className="mt-4">
                    Join us at <strong>{event.venue || event.location}</strong> for an unforgettable session.
                    This event is strictly monitored via our 4-way approval matrix to ensure the highest
                    standard of safety and engagement for all attendees.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/50 border border-border text-sm font-bold">
                  <Users className="w-5 h-5 text-primary" />
                  {event.attendees}+ Attending
                </div>
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-500">
                  <ShieldCheck className="w-5 h-5" />
                  Verified Event
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-2xl sticky top-32 space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Standard Entry</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">${event.price}</span>
                  <span className="text-muted-foreground">/ person</span>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Join the Experience
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure checkout powered by Planora QR+
                </p>
              </div>

              <div className="h-px bg-border/50" />

              <div className="space-y-4">
                <h4 className="font-bold text-sm">Organizer</h4>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase text-xs">
                    {(event.organizer || "PL").substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate">{event.organizer || "Planora Official"}</p>
                    <p className="text-xs text-muted-foreground">Verified Creator</p>
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

// Sparkles icon for consistency
function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  )
}

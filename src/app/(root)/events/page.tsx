"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/event.service";
import { joinRequestService } from "@/services/joinRequest.service";
import { authClient } from "@/lib/auth-client";

export default function EventsPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = authClient.useSession();

  /* Categories put aside for now
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: eventService.getAllCategories
  });
  const categories = categoriesData?.data || [];
  */

  // 2. Fetch Dynamic Events from API
  const { data: eventsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ["public-events", activeCategoryId, searchQuery],
    queryFn: () => eventService.getAllEvents({
      category: activeCategoryId === "All" ? undefined : activeCategoryId,
      searchTerm: searchQuery || undefined
    }),
  });

  // 3. Fetch User's Join Requests for personalization
  const { data: requestsResponse, isLoading: requestsLoading } = useQuery({
    queryKey: ["my-join-requests"],
    queryFn: joinRequestService.getMyRequests,
    enabled: !!session,
  });

  const events = eventsResponse?.data || [];
  const myRequests = requestsResponse?.data || [];

  const isLoading = eventsLoading /* || categoriesLoading */ || (!!session && requestsLoading);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-linear-to-b from-background to-secondary/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Discover Public Events
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic">
                Explore the <span className="text-primary prose-2xl">Planora</span> Feed.
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-medium">
                From high-tech summits to underground art galleries, find the experiences that matter most to you.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background transition-all outline-none text-sm font-bold"
            />
          </div>
          
          {/* Categories put aside for now
          <div className="flex flex-wrap items-center gap-2">
            <button
               onClick={() => setActiveCategoryId("All")}
               className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeCategoryId === "All"
                   ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                   : "bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-transparent hover:border-primary/20"
               }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategoryId === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-transparent hover:border-primary/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          */}
        </div>

        {/* Results Info */}
        <div className="px-4 flex items-center justify-between">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {isLoading ? "Synchronizing feed..." : `Found ${events.length} Live ${events.length === 1 ? 'Event' : 'Events'}`}
          </p>
        </div>

        {/* Event Grid / Loading State */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center gap-4"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground font-medium italic animate-pulse">Syncing nodes with Planora DB...</p>
            </motion.div>
          ) : events.length > 0 ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {events.map((event, index) => {
                const userRequest = myRequests.find(req => req.eventId === event.id);
                return (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    priority={index < 2} 
                    status={userRequest?.status}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center space-y-6 bg-secondary/20 rounded-4xl border border-dashed border-border"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">No events found</h3>
                <p className="text-muted-foreground">Adjust your filters or try a different search term.</p>
              </div>
              <button 
                onClick={() => { setActiveCategoryId("All"); setSearchQuery(""); }}
                className="text-primary font-black uppercase tracking-tighter hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
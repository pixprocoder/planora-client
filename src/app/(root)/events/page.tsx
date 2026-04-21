"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { MOCK_EVENTS } from "@/constants/mock-events";

const CATEGORIES = ["All", "Technology", "Music", "Arts", "Business"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black uppercase tracking-widest text-primary"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Discover Public Events
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                Explore the <span className="text-primary italic">Planora</span> Feed.
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                From high-tech summits to underground art galleries, find the experiences that matter most to you.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-[2.5rem] bg-card border border-border shadow-xl">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-3xl bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background transition-all outline-none text-sm font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="px-4">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
          </p>
        </div>

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} {...event} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No events found</h3>
              <p className="text-muted-foreground">Adjust your filters or try a different search term.</p>
            </div>
            <button 
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  price: string;
  attendees: number;
  image: string;
  priority?: boolean;
}

export function EventCard({
  id,
  title,
  description,
  date,
  location,
  category,
  price,
  attendees,
  image,
  priority = false,
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-60" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-widest text-primary">
          {category}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg">
          {price === "0" ? "Free" : `$${price}`}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              {date}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold">{attendees}+ Joined</span>
            </div>
            <Link
              href={`/events/${id}`}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group/link"
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

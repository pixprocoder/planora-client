"use client";

import { authClient } from "@/lib/auth-client";
import { eventService } from "@/services/event.service";
import { joinRequestService } from "@/services/joinRequest.service";
import { reviewService } from "@/services/review.service";
import { formatDate, formatTime } from "@/utils/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Info,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Sparkles as SparklesIcon,
  Star,
  UserCircle2,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = authClient.useSession();

  // Review Form State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // 1. Fetch Dynamic Event Data
  const { data: eventResponse, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEventById(id as string),
    enabled: !!id,
  });
  const event = eventResponse?.data;

  // 2. Fetch User's Join Requests
  const { data: myRequestsResponse } = useQuery({
    queryKey: ["my-join-requests"],
    queryFn: joinRequestService.getMyRequests,
    enabled: !!session,
  });
  const hasRequested = myRequestsResponse?.data?.some(req => req.eventId === id);
  const myRequest = myRequestsResponse?.data?.find(req => req.eventId === id);
  const isApprovedParticipant = myRequest?.status === "APPROVED";

  // 3. Fetch Event Reviews
  const { data: reviewsResponse, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["event-reviews", id],
    queryFn: () => reviewService.getEventReviews(id as string),
    enabled: !!id,
  });
  const reviews = reviewsResponse?.data || [];

  // 4. Mutations
  const joinMutation = useMutation({
    mutationFn: () => joinRequestService.createJoinRequest({ eventId: id as string }),
    onSuccess: () => {
      toast.success("Join request sent! The organizer will review it.");
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to send join request";
      toast.error(message);
    }
  });

  const reviewMutation = useMutation({
    mutationFn: () => reviewService.createReview({ eventId: id as string, rating, comment }),
    onSuccess: () => {
      toast.success("Experience feedback synchronized!");
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["event-reviews", id] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit review";
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating (1-5 stars)");
      return;
    }
    reviewMutation.mutate();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasEventCommenced = event ? new Date(event.date).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) : false;
  const canReview = isApprovedParticipant && hasEventCommenced;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Loading event details...</p>
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
          <p className="text-muted-foreground">The experience you are looking for doesn&apos;t exist or has been removed.</p>
        </div>
        <Link href="/events" className="text-primary font-black uppercase tracking-widest hover:underline flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          All Events
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
                <h2 className="text-3xl font-black tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-4">About this Event</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-lg font-medium">
                  <p>{event.description}</p>
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

            {/* Event Reviews Section */}
            <div className="p-8 md:p-14 rounded-[3.5rem] bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl space-y-12">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                    <Star className="w-8 h-8 text-amber-400" />
                    Event Reviews
                  </h2>
                  <p className="text-muted-foreground font-medium italic">Real feedback from verified attendees.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-secondary/50 border border-border font-black uppercase text-xs">
                  <span className="text-primary text-lg">{reviews.length}</span>
                  Reviews
                </div>
              </div>

              {/* 1. Leave a Review Feed (Conditional) */}
              {canReview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase tracking-tight">Share Your Thoughts</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Let others know about your experience.</p>
                    </div>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Your Rating</label>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-all hover:scale-125"
                          >
                            <Star
                              className={`w-8 h-8 ${(hoverRating || rating) >= star
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/30"
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Your Review</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you think of the event?"
                        className="w-full bg-background border border-border/50 rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none h-32 resize-none italic font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewMutation.isPending}
                      className="flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {reviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Review
                    </button>
                  </form>
                </motion.div>
              )}

              {/* 2. Review List Trajectory */}
              <div className="space-y-6">
                {isLoadingReviews ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse italic">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 rounded-[2.5rem] bg-secondary/20 border border-border/40 backdrop-blur-sm space-y-6 group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary border border-border/50 flex items-center justify-center overflow-hidden relative">
                            {review.user?.image ? (
                              <Image src={review.user.image} alt={review.user.name} fill className="object-cover" unoptimized />
                            ) : (
                              <UserCircle2 className="w-8 h-8 text-muted-foreground/30" />
                            )}
                          </div>
                          <div>
                            <p className="font-black italic uppercase tracking-tight">{review.user?.name}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground italic">Verified Participant</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${review.rating >= star
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/20"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="prose prose-invert">
                        <p className="text-muted-foreground font-medium italic leading-relaxed">&quot;{review.comment}&quot;</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">No reviews yet.</p>
                  </div>
                )}
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

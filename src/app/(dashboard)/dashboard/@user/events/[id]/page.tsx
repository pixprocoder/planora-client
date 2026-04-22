"use client";

import { eventService } from "@/services/event.service";
import { 
    EventVisibility, 
    ICreateEventRequest, 
    IEventsResponse 
} from "@/types/event.types";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Rocket,
  Settings,
  Ticket,
  Type,
  Users as UsersIcon,
  LayoutGrid,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate, formatTime } from "@/utils/date";
import { AttendeeTable } from "@/components/dashboard/AttendeeTable";
import { joinRequestService } from "@/services/joinRequest.service";
import { confirmAction } from "@/utils/confirmModal";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Type },
  { id: 2, title: "Logistics", icon: MapPin },
  { id: 3, title: "Ticketing", icon: Ticket },
  { id: 4, title: "Preview", icon: Rocket }
];

export default function ManageEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "ATTENDEES">("SETTINGS");

  // 1. Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: eventService.getAllCategories
  });
  const categories = categoriesData?.data || [];

  // 2. Optimization: Peek into "my-events" cache for immediate data
  const cachedEvents = queryClient.getQueryData<IEventsResponse>(["my-events"]);
  const cachedEvent = cachedEvents?.data?.find((e) => e.id === eventId);

  // 3. Fetch/Sync Event Details
  const { data: eventResponse, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["events", eventId],
    queryFn: () => eventService.getEventById(eventId),
    initialData: cachedEvent ? { data: cachedEvent, success: true, message: "From Cache" } : undefined,
  });
  const eventData = eventResponse?.data;

  // 4. Fetch Join Requests for this event
  const { data: requestsResponse, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["event-requests", eventId],
    queryFn: () => joinRequestService.getEventRequests(eventId),
    enabled: activeTab === "ATTENDEES"
  });
  const requests = requestsResponse?.data || [];

  // 5. TanStack Form Implementation
  const form = useForm({
    defaultValues: {
      title: eventData?.title || "",
      description: eventData?.description || "",
      venue: eventData?.venue || "",
      date: eventData?.date || "",
      time: eventData?.time || "",
      visibility: (eventData?.visibility || "PUBLIC") as EventVisibility,
      fee: eventData?.fee || 0,
      categoryId: eventData?.categoryId || null,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value as ICreateEventRequest);
    },
  });

  useEffect(() => {
    if (eventData) {
      form.reset({
        title: eventData.title,
        description: eventData.description,
        venue: eventData.venue,
        date: eventData.date,
        time: eventData.time,
        visibility: eventData.visibility,
        fee: eventData.fee,
        categoryId: eventData.categoryId as string,
      });
    }
  }, [eventData, form]);

  const mutation = useMutation({
    mutationFn: (data: ICreateEventRequest) => eventService.updateEvent(eventId, data),
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      router.push("/dashboard/events");
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || "Failed to update event";
      toast.error(message);
    }
  });

  // 6. Delete Mutation for the Danger Zone
  const deleteMutation = useMutation({
    mutationFn: () => eventService.deleteEvent(eventId),
    onSuccess: () => {
      toast.success("Experience node surgicaly removed from matrix");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      router.push("/dashboard/events");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to moderate discovery node";
      toast.error(message);
    }
  });

  const handleDelete = async () => {
    const confirmed = await confirmAction(
      "Surgical Removal",
      `Are you sure you want to delete "${eventData?.title}"? This cannot be undone.`
    );
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const formValues = useStore(form.store, (state) => state.values);
  const { title, description, date, time, venue } = formValues;

  const isStepValid = (step: number) => {
    if (step === 1) return !!title && !!description;
    if (step === 2) return !!date && !!time && !!venue;
    return true;
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Fetching event blueprints...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tight italic uppercase text-primary">Manage Event</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Update your discovery node settings and attendee matrix.</p>
        </div>
        <div className="w-16 h-16 rounded-[2rem] bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/50">
          <Settings className="w-8 h-8" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-secondary/30 border border-border/50 rounded-[2rem] mb-12 w-fit mx-2 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("SETTINGS")}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "SETTINGS" 
              ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]" 
              : "text-muted-foreground hover:bg-secondary/50"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={() => setActiveTab("ATTENDEES")}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "ATTENDEES" 
              ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]" 
              : "text-muted-foreground hover:bg-secondary/50"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          Attendee Matrix
          {requests.filter(r => r.status === "PENDING").length > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse ml-1 border-2 border-white/10" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "SETTINGS" ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12 px-2"
          >
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative px-8">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 translate-y-[-50%]" />
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isCurrent
                        ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110"
                        : isActive
                          ? "bg-primary/20 text-primary border border-primary/20"
                          : "bg-secondary text-muted-foreground border border-border/50"
                        }`}
                    >
                      {isActive && currentStep > step.id ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Form Content */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="bg-card border border-border/50 rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-primary/5 min-h-[450px] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10"
                >
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <form.Field name="title">
                        {(field) => (
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Event Title</label>
                            <input
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="e.g. NextGen Tech Summit 2026"
                              className="w-full bg-secondary/30 border border-border/50 rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none text-xl font-black italic tracking-tight"
                            />
                          </div>
                        )}
                      </form.Field>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <form.Field name="categoryId">
                          {(field) => (
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Category Domain</label>
                              <select
                                value={field.state.value || ""}
                                onChange={(e) => field.handleChange(e.target.value || null)}
                                className="w-full bg-secondary/30 border border-border/50 rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold italic"
                              >
                                <option value="">Select Domain</option>
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="visibility">
                          {(field) => (
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Privacy Matrix</label>
                              <div className="flex gap-2 p-1.5 bg-secondary/30 rounded-2xl border border-border/50">
                                <button
                                  type="button"
                                  onClick={() => field.handleChange("PUBLIC")}
                                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${field.state.value === "PUBLIC" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-secondary/50"}`}
                                >
                                  <Eye className="w-4 h-4" />
                                  Public
                                </button>
                                <button
                                  type="button"
                                  onClick={() => field.handleChange("PRIVATE")}
                                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${field.state.value === "PRIVATE" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-secondary/50"}`}
                                >
                                  <EyeOff className="w-4 h-4" />
                                  Private
                                </button>
                              </div>
                            </div>
                          )}
                        </form.Field>
                      </div>

                      <form.Field name="description">
                        {(field) => (
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Narrative Description</label>
                            <textarea
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="Define the core experience..."
                              className="w-full bg-secondary/30 border border-border/50 rounded-2xl p-6 focus:ring-2 focus:ring-primary h-40 outline-none resize-none font-medium italic"
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <form.Field name="date">
                          {(field) => (
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Deployment Date</label>
                              <input
                                type="date"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full bg-secondary/30 border border-border/50 rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-black italic"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="time">
                          {(field) => (
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Deployment Time</label>
                              <input
                                type="time"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full bg-secondary/30 border border-border/50 rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-black italic"
                              />
                            </div>
                          )}
                        </form.Field>
                      </div>
                      <form.Field name="venue">
                        {(field) => (
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Experience Venue</label>
                            <div className="relative group">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                                <input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. Grand Ballroom, Hilton Hotel"
                                className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-primary outline-none font-bold italic"
                                />
                            </div>
                          </div>
                        )}
                      </form.Field>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-10">
                      <div className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 shadow-inner">
                        <div className="flex items-center gap-5 mb-8">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                            <Ticket className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-black text-2xl italic uppercase tracking-tight">Ticketing Matrix</h3>
                            <p className="text-xs text-muted-foreground font-medium italic">Define the value node for entry.</p>
                          </div>
                        </div>

                        <form.Field name="fee">
                          {(field) => (
                            <div className="space-y-3 max-w-sm">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Access Fee ($)</label>
                              <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-primary opacity-50">$</span>
                                <input
                                  type="number"
                                  value={field.state.value}
                                  onChange={(e) => field.handleChange(Number(e.target.value))}
                                  className="w-full bg-background border border-border/50 rounded-3xl py-6 pl-12 pr-8 focus:ring-2 focus:ring-primary text-3xl font-black outline-none tracking-tighter"
                                />
                              </div>
                              <p className="text-[9px] text-muted-foreground px-2 italic font-medium">Set to 0 for unconditional public access.</p>
                            </div>
                          )}
                        </form.Field>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-10">
                      <div className="flex flex-col items-center text-center py-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-8 animate-bounce shadow-xl shadow-primary/5">
                          <Rocket className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Final Sync?</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mt-2 font-medium italic">Broadcast the updated blueprints to the discovery matrix.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[2rem] bg-secondary/20 border border-border/40 backdrop-blur-sm">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Primary Node</p>
                          <p className="text-xl font-black italic truncate">{title || "Untitled"}</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-secondary/20 border border-border/40 backdrop-blur-sm">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Deployment</p>
                          <p className="text-xl font-black italic">{formatDate(date)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-16 flex items-center justify-between pt-10 border-t border-border/30">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${currentStep === 1 ? "opacity-0 invisible" : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous Node
                </button>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    Continue Sync
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex items-center gap-4 px-14 py-6 bg-primary text-primary-foreground rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {mutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                    Deploy Updates
                  </button>
                )}
              </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-20 p-10 md:p-14 rounded-[4rem] bg-rose-500/5 border border-rose-500/20 shadow-xl shadow-rose-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] -z-10" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-3">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-rose-500 flex items-center gap-4">
                            <AlertTriangle className="w-10 h-10" />
                            Danger Zone
                        </h3>
                        <p className="text-muted-foreground font-medium italic max-w-lg leading-relaxed">
                            Permanently moderate this experience node. This action is surgical and irreversible. 
                            <span className="block mt-2 text-rose-500/70 font-black text-[10px] uppercase tracking-widest">
                                * Restriction: Events with active participants cannot be removed.
                            </span>
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="flex items-center justify-center gap-4 px-12 py-6 bg-rose-500 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {deleteMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Trash2 className="w-6 h-6" />}
                        Surgical Removal
                    </button>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="attendees"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 px-2"
          >
            <div className="p-10 md:p-16 bg-card border border-border/50 rounded-[4rem] shadow-2xl shadow-primary/5 min-h-[450px]">
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                    <UsersIcon className="w-8 h-8 text-primary" />
                    Attendee Matrix
                  </h2>
                  <p className="text-muted-foreground font-medium italic">Synchronize and moderate nodes attempting to join this experience.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary shadow-inner">
                  <span className="text-lg">{requests.length}</span>
                  Nodes
                </div>
              </div>

              {isLoadingRequests ? (
                <div className="py-32 flex flex-col items-center justify-center gap-6">
                   <Loader2 className="w-12 h-12 text-primary animate-spin" />
                   <p className="text-muted-foreground font-black italic uppercase text-xs tracking-[0.2em] animate-pulse">Scanning matrix...</p>
                </div>
              ) : (
                <AttendeeTable eventId={eventId} requests={requests} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

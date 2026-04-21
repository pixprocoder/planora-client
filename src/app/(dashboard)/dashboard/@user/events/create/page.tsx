"use client";

import { eventService } from "@/services/event.service";
import { EventVisibility, ICreateEventRequest } from "@/types/event.types";
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
  Ticket,
  Type
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Type },
  { id: 2, title: "Logistics", icon: MapPin },
  { id: 3, title: "Ticketing", icon: Ticket },
  { id: 4, title: "Preview", icon: Rocket }
];

export default function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch real categories from the server
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: eventService.getAllCategories
  });

  const categories = categoriesData?.data || [];

  // TanStack Form Implementation
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      venue: "",
      date: "",
      time: "",
      visibility: "PUBLIC" as EventVisibility,
      fee: 0,
      categoryId: null as string | null,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value as ICreateEventRequest);
    },
  });

  const mutation = useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      toast.success("Event launched successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/dashboard/events");
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || "Failed to create event";
      toast.error(message);
    }
  });

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Correct useStore pattern for @tanstack/react-form v1.29.0
  const formValues = useStore(form.store, (state) => state.values);
  const { title, description, date, time, venue } = formValues;

  const isStepValid = (step: number) => {
    if (step === 1) return !!title && !!description;
    if (step === 2) return !!date && !!time && !!venue;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground mt-1">Synchronized with Planora Server Schema.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 translate-y-[-50%]" />
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isCurrent
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                    : isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
              >
                {isActive && currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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
        className="bg-card border border-border/50 rounded-4xl p-8 md:p-12 shadow-xl shadow-primary/5 min-h-[400px] relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <form.Field name="title">
                  {(field) => (
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Event Title</label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. NextGen Tech Summit 2026"
                        className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none text-lg font-bold"
                      />
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form.Field name="categoryId">
                    {(field) => (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Category</label>
                        <select
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value || null)}
                          className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none font-bold"
                        >
                          <option value="">Select Category</option>
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
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Visibility</label>
                        <div className="flex gap-2 p-1 bg-secondary/50 rounded-2xl border border-border">
                          <button
                            type="button"
                            onClick={() => field.handleChange("PUBLIC")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${field.state.value === "PUBLIC" ? "bg-primary text-white shadow-md" : "text-muted-foreground"}`}
                          >
                            <Eye className="w-4 h-4" />
                            Public
                          </button>
                          <button
                            type="button"
                            onClick={() => field.handleChange("PRIVATE")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${field.state.value === "PRIVATE" ? "bg-primary text-white shadow-md" : "text-muted-foreground"}`}
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
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Description</label>
                      <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="What is this event about?"
                        className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary h-32 outline-none resize-none"
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form.Field name="date">
                    {(field) => (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Date</label>
                        <input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none font-bold"
                        />
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="time">
                    {(field) => (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Time</label>
                        <input
                          type="time"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none font-bold"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>
                <form.Field name="venue">
                  {(field) => (
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Venue / Location</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Grand Ballroom, Hilton Hotel"
                        className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl italic">Ticketing & Fee</h3>
                      <p className="text-sm text-muted-foreground">Define the cost of entry for this event.</p>
                    </div>
                  </div>

                  <form.Field name="fee">
                    {(field) => (
                      <div className="space-y-2 max-w-sm">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Entry Fee ($)</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-primary">$</span>
                          <input
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            className="w-full bg-background border border-border rounded-2xl py-5 pl-10 pr-6 focus:ring-2 focus:ring-primary text-2xl font-black outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground px-2 italic">Set to 0 for free events.</p>
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
                    <Rocket className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black italic">Ready to Sync?</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mt-2">Your event is ready to be sent to the Planora Server.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Title</p>
                    <p className="text-lg font-bold">{title || "Untitled"}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Schedule</p>
                    <p className="text-lg font-bold">{date} at {time}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Fee</p>
                    <p className="text-lg font-bold text-primary">{form.getFieldValue("fee") === 0 ? "FREE" : `$${form.getFieldValue("fee")}`}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Visibility</p>
                    <p className="text-lg font-bold">{form.getFieldValue("visibility")}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-border/50">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${currentStep === 1 ? "opacity-0 invisible" : "text-muted-foreground hover:bg-secondary"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className="flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
              Launch Event
            </button>
          )}
        </div>
      </form>

      {isLoadingCategories && (
        <div className="fixed bottom-10 right-10 p-4 bg-primary text-white rounded-2xl shadow-xl flex items-center gap-3 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          Synchronizing Categories...
        </div>
      )}
    </div>
  );
}

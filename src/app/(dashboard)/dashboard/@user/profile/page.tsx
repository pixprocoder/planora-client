"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Mail, 
  Phone, 
  Shield, 
  User, 
  Save, 
  X, 
  Loader2,
  CheckCircle2,
  Globe
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";
import { userService } from "@/services/user.service";
import { IUpdateProfileRequest } from "@/types/user.types";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // 1. Fetch Latest Profile Data
  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["me"],
    queryFn: userService.getMyProfile
  });
  const user = profileResponse?.data;

  // 2. TanStack Form Implementation
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      image: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value as IUpdateProfileRequest);
    },
  });

  // 3. Hydrate Form on Data Load
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        image: user.image || "",
      });
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsEditing(false);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    }
  });

  const formValues = useStore(form.store, (state) => state.values);

  if (isLoadingProfile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Synchronizing your identity...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      {/* Header Container */}
      <div className="flex flex-col items-center text-center space-y-4 pt-10">
        <div className="relative group">
          <div className="w-36 h-36 rounded-[2.5rem] bg-primary/10 overflow-hidden border-4 border-background shadow-2xl relative">
            {formValues.image ? (
              <Image 
                src={formValues.image} 
                alt={user?.name || "Avatar"} 
                fill 
                className="object-cover" 
                unoptimized 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary">
                <User className="w-16 h-16" />
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -bottom-2 -right-2 flex flex-col gap-2"
              >
                <div className="p-3 bg-primary text-white rounded-2xl shadow-xl">
                  <Camera className="w-5 h-5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <form.Field name="name">
              {(field) => (
                <input 
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="text-3xl font-black tracking-tight text-center bg-secondary/50 border border-primary/20 rounded-2xl px-6 py-2 outline-none focus:ring-2 focus:ring-primary w-full max-w-md mx-auto"
                  placeholder="Enter your name"
                />
              )}
            </form.Field>
          ) : (
            <h2 className="text-4xl font-black tracking-tight italic uppercase">{user?.name}</h2>
          )}
          <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>
        </div>

        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-3 h-4" />
          {user?.role} Account
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div 
            key="editing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="p-8 rounded-4xl bg-card border-2 border-primary/20 shadow-xl shadow-primary/5 space-y-6">
              <form.Field name="phone">
                  {(field) => (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none font-bold"
                        />
                      </div>
                    </div>
                  )}
              </form.Field>

              <form.Field name="image">
                  {(field) => (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avatar Image URL</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none font-bold"
                        />
                      </div>
                    </div>
                  )}
              </form.Field>
            </div>

            <div className="p-8 rounded-4xl bg-primary/5 border border-primary/20 flex flex-col justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black italic underline decoration-primary decoration-4">Ready to Sync?</h3>
              <p className="text-sm text-muted-foreground">Updating your profile will reflect across all Planora modules instantly.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="viewing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { label: "Phone Number", value: user?.phone || "Not set", icon: Phone },
              { label: "Account Status", value: user?.status || "Active", icon: Shield },
              { label: "Email Address", value: user?.email, icon: Mail },
              { label: "Member Since", value: new Date(user?.createdAt || "").toLocaleDateString(), icon: CheckCircle2 },
            ].map((item) => (
              <div key={item.label} className="p-8 rounded-4xl bg-card border border-border/50 flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                  <p className="text-xl font-bold mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        {isEditing ? (
          <>
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-3xl font-bold border border-border/50 hover:bg-secondary/80 transition-all"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button 
              onClick={() => form.handleSubmit()}
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground rounded-3xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-10 py-5 bg-primary text-primary-foreground rounded-3xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Edit Profile
            </button>
            <button className="px-10 py-5 bg-secondary text-secondary-foreground rounded-3xl font-bold border border-border/50 hover:bg-secondary/80 transition-all">
              Account Logic
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

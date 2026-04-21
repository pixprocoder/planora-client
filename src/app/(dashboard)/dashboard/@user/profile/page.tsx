"use client";

import { useSession } from "@/lib/auth-client";
import { ISession } from "@/types";
import { motion } from "framer-motion";
import { User, Mail, Phone, Shield, Camera } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const sessionData = useSession();
  const session = sessionData.data as ISession | null;

  if (!session) return null;

  const { user } = session;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 overflow-hidden border-4 border-background shadow-2xl relative">
            {user.image ? (
              <Image src={user.image} alt={user.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
          {user.role} Account
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Phone Number", value: user.phone || "Not set", icon: Phone },
          { label: "Account Status", value: user.status || "Active", icon: Shield },
          { label: "Email Address", value: user.email, icon: Mail },
        ].map((item) => (
          <div key={item.label} className="p-8 rounded-4xl bg-card border border-border/50 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-bold mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-3xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
          Edit Profile
        </button>
        <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-3xl font-bold border border-border/50 hover:bg-secondary/80 transition-colors">
          Security Settings
        </button>
      </div>
    </motion.div>
  );
}

"use client";

import { SidebarContent } from "@/components/dashboard/SidebarContent";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth.store";
import { ISession } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function DashboardLayout(props: {
  children: ReactNode;
  admin: ReactNode;
  user: ReactNode;
}) {
  const sessionData = useSession();
  const session = sessionData.data as ISession | null;
  const isPending = sessionData.isPending;

  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    if (session?.user) {
      setAuth(session.user);
    }
  }, [session, isPending, router, setAuth]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Securing your session...
        </p>
      </div>
    );
  }

  if (!session) return null;

  const role = session.user.role?.toUpperCase() || "USER";

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl hidden md:flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent session={session} />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border p-6 z-60 md:hidden shadow-2xl flex flex-col"
            >
              <SidebarContent
                session={session}
                closeMobileMenu={() => setIsMobileMenuOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full -z-10" />

        <header className="h-20 md:h-16 border-b border-border flex items-center justify-between px-6 md:px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 md:hidden hover:bg-secondary rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-sm font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[200px] md:max-w-none">
              {role === "ADMIN" ? "Admin Panel" : "User Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden relative border border-primary/20 group-hover:scale-105 transition-transform">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={36}
                    height={36}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs font-bold truncate max-w-[100px]">{session.user.name}</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{session.user.email}</span>
              </div>
            </Link>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {/* Parallel Slot Rendering Logic */}
          {role === "ADMIN" ? props.admin : props.user}

          {/* Render children for common sub-routes like /profile */}
          {props.children}
        </div>
      </main>
    </div>
  );
}


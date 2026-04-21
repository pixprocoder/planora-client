"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Bell, Calendar, LayoutDashboard, Loader2, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function DashboardLayout(props: {
  children: ReactNode;
  admin: ReactNode;
  user: ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    if (session?.user) {
      setAuth(session.user);
    }
  }, [session, isPending, router, setAuth]);

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

  const role = session.user.role?.toUpperCase();

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Premium Sidebar (remains shared) */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl hidden md:flex flex-col p-6 sticky top-0 h-screen">
        {/* ... Sidebar content ... */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calendar className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Planora</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
            { name: "My Events", icon: Calendar, href: "/dashboard/events" },
            { name: "Profile", icon: User, href: "/dashboard/profile" },
            { name: "Notifications", icon: Bell, href: "/dashboard/notifications" },
            { name: "Settings", icon: Settings, href: "/dashboard/settings" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group hover:bg-primary/10 hover:text-primary",
                "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Card */}
        <div className="mt-auto p-4 rounded-2xl bg-secondary/50 border border-border/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{session.user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full -z-10" />

        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            {role === "ADMIN" ? "Admin Panel" : "User Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto">
          {/* Parallel Slot Rendering Logic */}
          {role === "ADMIN" ? props.admin : props.user}

          {/* Render children for common sub-routes like /profile */}
          {props.children}
        </div>
      </main>
    </div>
  );
}


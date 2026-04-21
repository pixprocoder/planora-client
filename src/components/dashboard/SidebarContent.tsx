"use client";

import { ADMIN_NAV_LINKS, USER_NAV_LINKS } from "@/constants";
import { ISession } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SidebarContentProps {
  session: ISession;
  closeMobileMenu?: () => void;
}

export function SidebarContent({ session, closeMobileMenu }: SidebarContentProps) {
  const router = useRouter();
  const role = session.user.role?.toUpperCase() || "USER";
  const navLinks = role === "ADMIN" ? ADMIN_NAV_LINKS : USER_NAV_LINKS;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header / Logo */}
      <div className="flex items-center justify-between mb-10 px-2">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          onClick={closeMobileMenu}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Planora</span>
        </Link>
      </div>

      {/* Utilities */}
      <div className="mb-6 px-2 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-primary transition-all"
          onClick={closeMobileMenu}
        >
          <Home className="w-4 h-4" />
          Back to Website
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navLinks.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={closeMobileMenu}
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

      {/* User Logout */}
      <div className="mt-auto pt-6">

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

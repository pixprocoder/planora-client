"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  const navLinks = [
    { name: "Events", href: "/events" },
    { name: "Organizers", href: "/organizers" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group relative z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              Planora
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:-translate-y-px"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 relative z-50">
            <AnimatePresence mode="wait">
              {session ? (
                <motion.div
                  key="user-actions"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 md:gap-4 relative"
                >
                  <Link
                    href="/dashboard"
                    className="hidden xs:flex items-center gap-2 text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsProfileOpen(!isProfileOpen);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 overflow-hidden flex items-center justify-center relative hover:ring-2 hover:ring-primary transition-all shadow-inner group"
                    >
                      {session.user.image ? (
                        <NextImage
                          src={session.user.image}
                          alt={session.user.name ?? "User avatar"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-3 w-56 bg-card/90 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-2xl z-50"
                        >
                          <div className="p-3 border-b border-border/50 mb-2">
                            <p className="text-sm font-bold truncate">{session.user.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
                          </div>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 w-full p-3 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-2 w-full p-3 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>
                          <div className="h-px bg-border/50 my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full p-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="guest-actions"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3"
                >
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 sm:px-6"
                  >
                    Join Now
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsProfileOpen(false);
              }}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors text-foreground"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border pt-24 pb-8 px-6 md:hidden overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 px-2 text-lg font-bold text-muted-foreground hover:text-primary transition-colors border-b border-border/50 group"
                  >
                    {link.name}
                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}

              {session && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-6 space-y-3"
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-4 px-6 bg-secondary text-secondary-foreground rounded-2xl font-bold hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

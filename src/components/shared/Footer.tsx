import Link from "next/link";
import { Calendar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Calendar className="text-primary w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Planora</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
          <Link href="/organizers" className="hover:text-primary transition-colors">Organizers</Link>
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </div>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Planora. Built with elegance.
        </p>
      </div>
    </footer>
  );
}
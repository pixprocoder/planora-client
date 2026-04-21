import { Bell, Calendar, LayoutDashboard, Settings, User } from "lucide-react";

export const DASHBOARD_NAV_LINKS = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Events", icon: Calendar, href: "/dashboard/events" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
] as const;

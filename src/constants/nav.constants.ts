import { Bell, Calendar, LayoutDashboard, Settings, User, Layers, Users } from "lucide-react";

export const ADMIN_NAV_LINKS = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Global Events", icon: Calendar, href: "/dashboard/events" },
  { name: "Categories", icon: Layers, href: "/dashboard/categories" },
  { name: "User Management", icon: Users, href: "/dashboard/users" },
  { name: "System Notifications", icon: Bell, href: "/dashboard/notifications" },
  { name: "Admin Settings", icon: Settings, href: "/dashboard/settings" },
] as const;

export const USER_NAV_LINKS = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Events", icon: Calendar, href: "/dashboard/events" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
] as const;

"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Merit Dashboard",
  "/dashboard/merits": "Merit Points",
  "/dashboard/events": "Browse Events",
  "/dashboard/leaderboard": "Merit Leaderboard",
  "/dashboard/reports": "Merit Reports",
  "/dashboard/admin/merit-upload": "Admin - Upload Merit",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Users,
  Building2,
  BarChart3,
  Lock,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    disabled: true,
  },
  {
    label: "Users",
    icon: Users,
    disabled: true,
  },
  {
    label: "Organizations",
    icon: Building2,
    disabled: true,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/account/profile",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block w-64 shadow-md">
      <div className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <TooltipProvider key={route.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                {route.href && !route.disabled ? (
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/80 hover:shadow-md",
                      pathname === route.href ? "bg-accent shadow-sm" : "hover:translate-x-1"
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ) : (
                  <div
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </div>
                )}
              </TooltipTrigger>
              {route.disabled && (
                <TooltipContent>
                  <p>Coming soon</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/app/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarComp({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start",
            pathname === item.href ? "bg-slate-300 hover:bg-slate-300 dark:bg-slate-800  font-medium" : "bg-transparent hover:bg-slate-300/35 dark:hover:bg-slate-800/50"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
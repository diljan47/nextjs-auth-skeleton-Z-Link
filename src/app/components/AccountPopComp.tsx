"use client"

import {
  BadgeCheck,
  LogOut,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { logOutAction } from "../actions/actions";
import { useState } from "react";

export function NavUser({
  user,
}: {
  user: {
    name: string | undefined
    email: string | undefined
  }
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logOutAction();
    router.push("/signin");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div 
        className="relative"
        onMouseEnter={() => !open && setOpen(true)}
        onMouseLeave={() => open && setOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center space-x-2 transition-all duration-300 ease-out hover:opacity-80"
          >
            <Avatar className="h-9 w-9 rounded-full transform transition-transform duration-300 ease-out hover:scale-105">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile"/>
              <AvatarFallback className="rounded-full">CN</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100 transition-all duration-300 ease-out"
          side="bottom"
          align="start"
          sideOffset={4}
          forceMount
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src="https://github.com/shadcn.png" alt="Account"/>
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <div >
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="transition-colors  duration-200 ease-out hover:bg-slate-100 dark:hover:bg-slate-800">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={() => router.push("/account/profile")}
                className="transition-colors duration-200 ease-out cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <BadgeCheck className="mr-2 h-4 w-4" />
                Account 
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 cursor-pointer transition-colors duration-200 ease-out hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  )
}

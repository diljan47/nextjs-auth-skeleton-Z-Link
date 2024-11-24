import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { SidebarComp } from "./sidebarComp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/darkmode";
import { BackButtonComp } from "@/app/components/BackButtonComp";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/account/profile",
  },
  {
    title: "Security",
    href: "/account/security",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen ">
      <header className="flex  justify-between items-center p-6  fixed w-full z-40">
        <Link href="/">
          <h1
            className="text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-indigo-500 text-transparent bg-clip-text"
        >
          Zauth.
          </h1>
        </Link>
        <ModeToggle  />
      </header>

      <div className="hidden  container  mx-auto md:block space-y-6 p-4 md:p-10 pb-16">

        <div className="space-y-0.5 mt-20">
      <BackButtonComp fallbackUrl="/dashboard" className="mb-1 p-2 hover:bg-slate-200 dark:hover:bg-slate-800" variant="ghost" />
          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col lg:flex-row lg:gap-12">
          <aside className="lg:w-1/4 xl:w-1/5">
            <SidebarComp items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-3xl">{children}</div>
        </div>
      </div>
    </div>
  );
}

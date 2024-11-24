"use server";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import DashboardButton from "./components/DashboardBtn";
import { ModeToggle } from "@/components/ui/darkmode";
import { BackgroundLines } from "@/components/ui/background-lines";
import Link from "next/link";
import { getSessionToken } from "./utils/session";

export default async function Home() {
  const session = await getSessionToken();
  const isLoggedIn = session.success;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 fixed w-full z-40">
        <Link href="/">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-indigo-500 text-transparent bg-clip-text">
            Zauth.
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex space-x-2">
            {!isLoggedIn && (
              <>
                <Link href="/signin">
                  <Button
                    variant="default"
                    className="hover:bg-slate-500 transition duration-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="ghost"
                    className="hover:bg-slate-200 transition duration-300"
                  >
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </div>
          <ModeToggle className="ml-2" />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center">
        <BackgroundLines>
          <div className="space-y-6 px-4">
            <h1 className="bg-gradient-to-br from-slate-300 to-slate-600 py-4 bg-clip-text text-4xl md:text-7xl font-bold tracking-tight text-transparent">
              Authentication Made Simple
            </h1>
            <p className="text-slate-800 max-w-2xl mx-auto text-sm md:text-lg dark:text-slate-200">
              An open-source Next.js authentication template with email verification,
              password reset, and Google OAuth. Perfect for your next project.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <DashboardButton />
              <Button
                variant="outline"
                className="hover:bg-slate-500 transition duration-300 cursor-pointer"
              >
                {process.env.GITHUB_PERSONAL_LINK && (
                  <Link href={process.env.GITHUB_PERSONAL_LINK} target="_blank">
                    GitHub
                  </Link>
                )}
              </Button>
            </div>
          </div>
        </BackgroundLines>
      </main>

      <Toaster richColors position="bottom-center" duration={1500} />
    </div>
  );
}

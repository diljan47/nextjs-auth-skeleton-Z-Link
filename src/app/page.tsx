import { Toaster } from "sonner";
import { Button } from "@/app/components/ui/button";
import DashboardButton from "./components/DashboardBtn";
import { ModeToggle } from "@/app/components/ui/darkmode";
import { BackgroundLines } from "@/app/components/ui/background-lines";
import Link from "next/link";
import { getSessionToken } from "./utils/session";
import { GradualSpacing } from "@/app/components/ui/text-space-animation";
import { TechStack } from "@/app/components/ui/tech-stack";
import { FaGithub } from "react-icons/fa";

const github_link = process.env.GITHUB_PERSONAL_LINK

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSessionToken();
  const isLoggedIn = session.success;

  return (
    <div className="min-h-screen flex flex-col ">
      <header className="flex justify-between items-center p-6 fixed w-full z-40">
        <Link href="/">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-indigo-500 text-transparent bg-clip-text">
            Zauth.
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <div className="sm:hidden">
                <Link href="/signin">
                  <Button
                    variant="default"
                    className="hover:bg-slate-500 transition duration-300"
                  >
                    Login
                  </Button>
                </Link>
              </div>
              <div className="hidden sm:flex space-x-2">
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
              </div>
            </>
          )}
          <ModeToggle className="ml-2" />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center">
        <BackgroundLines>
          <div className="space-y-6 px-4 max-w-7xl mx-auto w-full">
            <div className="block sm:hidden space-y-[-12px]">
              <GradualSpacing 
                text="Authentication" 
                duration={0.2}
                delayMultiple={0.01}
                framerProps={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-gradient-to-r from-slate-500 to-slate-800 bg-clip-text text-transparent py-1 text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight dark:bg-gradient-to-r dark:from-cyan-600 dark:via-purple-400 dark:to-pink-400"
              />
              <GradualSpacing 
                text="Made Simple" 
                duration={0.2}
                delayMultiple={0.01}
                framerProps={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-gradient-to-r from-slate-500 to-slate-800 bg-clip-text text-transparent py-1 text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight dark:bg-gradient-to-r dark:from-cyan-600 dark:via-purple-400 dark:to-pink-400"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
            <div className="hidden sm:block">
              <GradualSpacing 
                text="Authentication Made Simple" 
                duration={0.3}
                delayMultiple={0.02}
                className="bg-gradient-to-r from-slate-500 to-slate-800 bg-clip-text text-transparent py-4 text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight dark:bg-gradient-to-r dark:from-cyan-600 dark:via-purple-400 dark:to-pink-400"
              />
            </div>
            <p className="text-slate-800 max-w-2xl mx-auto text-sm md:text-lg dark:text-slate-200 px-4">
              An open-source Next.js authentication template with email
              verification, password reset, and Google OAuth. Perfect for your
              next project.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <DashboardButton />
              <Button
                variant="outline"
                className="hover:bg-slate-500 transition duration-300 cursor-pointer"
              >
                {github_link && (
                  <Link href={github_link} target="_blank">
                    <span className="flex items-center gap-1">
                      GitHub
                      <FaGithub className="w-5 h-5" />
                    </span>
                  </Link>
                )}
              </Button>
            </div>
            <TechStack className="justify-center pt-8"/>
          </div>
        </BackgroundLines>
      </main>

      <Toaster richColors position="bottom-center" duration={1500} />
    </div>
  );
}

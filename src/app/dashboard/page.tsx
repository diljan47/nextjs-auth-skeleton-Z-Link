"use server";
import Link from "next/link";
import { validateUserAction } from "../actions/actions";
import { NavUser } from "../components/AccountPopComp";
import { Toaster } from "sonner";
import { ModeToggle } from "@/components/ui/darkmode";

export default async function Dashboard() {
  const session = await validateUserAction();
 
  return (
    <div className=" flex  min-h-screen">
      <header className="flex justify-between items-center p-6  fixed w-full z-40">
        <Link href="/">
          <h1
            className="text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-indigo-500 text-transparent bg-clip-text"
        >
          Zauth.
          </h1>
        </Link>
        <div className="flex justify-between px-5 gap-2 cursor-pointer">
          {session.success && (
          <NavUser user={{ name: session.name, email: session.email }} />
        )}
        <ModeToggle  />
        </div>
      </header>
      <Toaster richColors position="bottom-center" duration={1500} />
    </div>
  );
}

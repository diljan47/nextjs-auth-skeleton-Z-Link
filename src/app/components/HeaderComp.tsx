import Link from "next/link";
import { ModeToggle } from "@/components/ui/darkmode";

export default function HeaderComp() {
  return (
    <header className="flex justify-between items-center p-6  fixed w-full z-40">
      <Link href="/">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-indigo-500 text-transparent bg-clip-text">
          Zauth.
        </h1>
      </Link>

      <ModeToggle />
    </header>
  );
}

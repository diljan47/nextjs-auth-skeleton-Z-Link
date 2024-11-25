import { ModeToggle } from "@/components/ui/darkmode";
import { NavUser } from "../../components/AccountPopComp";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
export function Header({ user }: { user: { name: string; email: string } }) {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60  bg-background/95 backdrop-blur z-20">
      <div className="h-14 flex items-center px-4 gap-4">
        <header className="flex justify-between items-center p-6  fixed w-full z-40">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-indigo-500 text-transparent bg-clip-text">
              Zauth.
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <NavUser user={{ name: user.name, email: user.email }} />
            <ModeToggle />
          </div>
        </header>
      </div>
      <Separator orientation="horizontal" className="my-1" />
    </div>
  );
}

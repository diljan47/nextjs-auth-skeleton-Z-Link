"use client"

import { cn } from "@/lib/utils"
import { 
  FaFingerprint, 
  FaKey,
  FaMoon,
  FaCookie
} from "react-icons/fa"
import { 
  SiNextdotjs,
  SiTypescript,
  SiMongodb,
  SiGooglecloud,
  SiJsonwebtokens,
  SiTailwindcss
} from "react-icons/si"
import { MdEmail } from "react-icons/md"
import { BiSolidComponent } from "react-icons/bi"

const features = [
  {
    name: "Next.js 15",
    icon: <SiNextdotjs className="h-5 w-5 text-slate-700/70 dark:text-slate-200/70" />,
  },
  {
    name: "MongoDB",
    icon: <SiMongodb className="h-5 w-5 text-green-500/70" />,
  },
  {
    name: "TOTP Authentication",
    icon: <FaFingerprint className="h-5 w-5 text-emerald-500/70" />,
  },
  {
    name: "Email Verification",
    icon: <MdEmail className="h-5 w-5 text-blue-500/70" />,
  },
  {
    name: "Session Auth",
    icon: <SiJsonwebtokens className="h-5 w-5 text-purple-500/70" />,
  },
  {
    name: "Password Reset",
    icon: <FaKey className="h-5 w-5 text-rose-500/70" />,
  },
  {
    name: "Google OAuth",
    icon: <SiGooglecloud className="h-5 w-5 text-yellow-500/70" />,
  },
  {
    name: "Shadcn UI",
    icon: <BiSolidComponent className="h-5 w-5 text-indigo-500/70" />,
  },
  {
    name: "Dark Mode",
    icon: <FaMoon className="h-5 w-5 text-slate-500/70" />,
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="h-5 w-5 text-blue-400/70" />,
  },
  {
    name: "Session Cookies",
    icon: <FaCookie className="h-5 w-5 text-amber-500/70" />,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="h-5 w-5 text-cyan-400/70" />,
  }
]

export function TechStack({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="flex w-full overflow-hidden">
        <div className="flex animate-marquee gap-4 whitespace-nowrap">
          {[...features, ...features].map((feature, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center gap-3 rounded-2xl bg-slate-200/5 px-4 py-3 text-sm 
                         text-slate-600/90 backdrop-blur-[1px] dark:bg-slate-800/5 dark:text-slate-300/90 
                         md:text-lg"
            >
              {feature.icon}
              <span className="font-medium">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  fallbackUrl?: string; // Optional fallback URL if there's no previous route
}

export function BackButtonComp({ 
  className = "", 
  variant = "ghost",
  fallbackUrl = "/"
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Try to go back in history, if not possible go to fallback URL
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button 
      variant={variant}
      onClick={handleBack}
      className={`gap-1 ${className}`}
    >
      <ChevronLeft className="h-5  w-5" />
      back
    </Button>
  );
}
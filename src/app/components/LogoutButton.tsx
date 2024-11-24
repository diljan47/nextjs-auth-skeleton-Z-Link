"use client";

import { logOutAction } from "../actions/actions";
import { useRouter } from "next/navigation";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  
  const handleLogout = async () => {

    await logOutAction();
    router.push("/signin");
  };

  return (
    <button
      className={className}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

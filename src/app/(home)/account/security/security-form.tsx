import { LogoutButton } from "@/app/components/LogoutButton";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
export default function AccountForm({
  isGoogleUser,
}: {
  isGoogleUser: Boolean | undefined;
}) {

  return (
    <div className="flex gap-2 justify-between items-center">
      {!isGoogleUser && (
        <Link href="/change-password">
          <Button
            variant="default"
        >
          Change Password
        </Button>
        </Link>
      )}
      <LogoutButton className={"bg-red-500 px-6 py-2 rounded-lg text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"} />
    </div>
  );
}

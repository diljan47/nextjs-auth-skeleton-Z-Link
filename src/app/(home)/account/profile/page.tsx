"use server";

import { Separator } from "@/components/ui/separator"
import ProfileForm from "./profile-form"
import { validateUserAction } from "@/app/actions/actions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function SettingsProfilePage() {
  const session = await validateUserAction();
  if (!session.success) {
    redirect("/signin");
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm email={session.email} name={session.name} bio={session.bio} />
      <Toaster richColors position="bottom-center" duration={1500} />
    </div>
  )
}
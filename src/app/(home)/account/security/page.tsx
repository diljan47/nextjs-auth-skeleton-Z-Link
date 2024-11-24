import { Separator } from "@/components/ui/separator"
import AccountForm from "./security-form"
import { validateUserAction } from "@/app/actions/actions";
import { Toaster } from "sonner";

export default async function SettingsSecurityPage() {
  const session =  await validateUserAction();
  if(!session.success){
    return {
      success: false,
      message: "Session expired",
    };
  } 

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <AccountForm isGoogleUser={session.isGoogleUser} />
      <Separator />
      <Toaster richColors position="bottom-center" duration={1500} />
    </div>
  )
}
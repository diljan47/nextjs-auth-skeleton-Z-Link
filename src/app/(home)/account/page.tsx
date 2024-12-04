import { validateUserAction } from "@/app/actions/actions"
import { Separator } from "@/app/components/ui/separator"
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default async function SettingsProfilePage() {
  const session = await validateUserAction(); 
  if(!session){
    return {
      success: false,
      message: "User not authenticated",
    }
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
      <Toaster richColors position="bottom-center" duration={1500} />
    </div>
  )
}
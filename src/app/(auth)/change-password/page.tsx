"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordProtectedPageAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { Button } from "@/app/components/ui/button";
import { FormField } from "@/app/components/ui/form";
import { FormItem, FormLabel } from "@/app/components/ui/form";
import { FormControl } from "@/app/components/ui/form";
import { FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Loader2 } from "lucide-react";
import { BackButtonComp } from "@/app/components/BackButtonComp";
import HeaderComp from "@/app/components/HeaderComp";

export const dynamic = "force-dynamic";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export default function ChangePassPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formMethods = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordType) => {
    try {
      setIsLoading(true);
      const response = await resetPasswordProtectedPageAction(data);
      if (response.success) {
        toast.success(response.message);
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An Unexpected Error Occurred, Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <HeaderComp />
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
      <BackButtonComp fallbackUrl="/dashboard" className="mb-1 p-2 hover:bg-slate-200 dark:hover:bg-slate-800" variant="ghost" />
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={formMethods.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your old password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? <Button className="w-full" type="submit" disabled={isLoading}><Loader2 className="animate-spin" />Loading...</Button> :
              <Button className="w-full" type="submit" >
                Change Password
              </Button>
            }
  
          </form>
        </FormProvider>
      </div>
        <Toaster richColors position="bottom-center" duration={1500} />
      </div>
    </>
  );
}

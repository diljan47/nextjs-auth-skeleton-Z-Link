"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPasswordCheckEmailActionResponse } from "../forgot-password/actions";
import { resetPasswordTokenCheckAction } from "./actions";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import HeaderComp from "@/app/components/HeaderComp";

const changePasswordSchema = z.object({
  password: z.string().min(1),
});

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";


  const formMethods = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (!token || token === "") {
      toast.error("Invalid token");
      setTimeout(() => {
        router.push("/signup");
      }, 1000);
    }
  }, [token, router]);
  const handleSubmit = async (data:ChangePasswordType) => {
try{
  setIsLoading(true);
    const response = await resetPasswordTokenCheckAction(data, token);
    if(!response.success){
      toast.error(response.message);
      return;
    }
    if (response.success) {
      toast.success(response.message);
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
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
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={formMethods.control}
            name="password"
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
          {isLoading ? <Button className="w-full" type="submit" disabled={isLoading}><Loader2 className="animate-spin" />Changing password...</Button> :
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
};

export default page;

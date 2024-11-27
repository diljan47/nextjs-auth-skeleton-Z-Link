"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { resetPasswordTokenCheckAction } from "./actions";

import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import HeaderComp from "@/app/components/HeaderComp";

export const dynamic = "force-dynamic";

const changePasswordSchema = z.object({
  password: z.string().min(1),
});

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const token = router.query.token;

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
  const handleSubmit = async (data: ChangePasswordType) => {
    try {
      setIsLoading(true);
      const response = await resetPasswordTokenCheckAction(
        data,
        token as string
      );
      if (!response.success) {
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-[380px] sm:max-w-md space-y-4 sm:space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold">Reset Password</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(handleSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <FormField
                control={formMethods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="text-sm sm:text-base"
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {isLoading ? (
                <Button
                  className="w-full text-sm sm:text-base"
                  type="submit"
                  disabled
                >
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Resetting...
                </Button>
              ) : (
                <Button className="w-full text-sm sm:text-base" type="submit">
                  Reset Password
                </Button>
              )}
            </form>
          </FormProvider>
        </div>
        <Toaster richColors position="bottom-center" duration={1500} />
      </div>
    </>
  );
};

export default ResetPasswordPage;

"use client";

import { verifyEmailVerificationAction } from "./actions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp";
import OtpResendComp from "@/app/components/OtpResendComp";
import { Loader2 } from "lucide-react";
import HeaderComp from "@/app/components/HeaderComp";

export const dynamic = 'force-dynamic';


const VerifyEmailSchema = z.object({
  otp: z.string().min(6),
});
type VerifyEmailType = z.infer<typeof VerifyEmailSchema>;

const VerifyEmailPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VerifyEmailType>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyEmailType) => {
    try {
      setIsLoading(true);
      const result = await verifyEmailVerificationAction(data);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error verifying email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderComp />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-[380px] sm:max-w-md space-y-4 sm:space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 mx-auto space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      Please enter the one-time password sent to your email address.
                    </FormDescription>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {isLoading ? (
                <Button className="w-full text-sm sm:text-base" type="submit" disabled={isLoading}>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Verifying...
                </Button>
              ) : (
                <Button className="w-full text-sm sm:text-base" type="submit">
                  Verify OTP
                </Button>
              )}
              <OtpResendComp />
              <Button
                onClick={() => router.push("/signin")}
                variant="link"
                className="w-full text-sm sm:text-base"
              >
                Back to Sign In
              </Button>
            </form>
          </Form>
        </div>
        <Toaster richColors position="bottom-center" duration={1500} />
      </div>
    </>
  );
};

export default VerifyEmailPage;
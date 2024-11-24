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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import OtpResendComp from "@/app/components/OtpResendComp";
import { Loader2 } from "lucide-react";
import HeaderComp from "@/app/components/HeaderComp";

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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
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
                    <FormDescription>
                      Please enter the one-time password sent to your email
                      address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading ? (
                <Button className="w-full" type="submit" disabled={isLoading}>
                  <Loader2 className="animate-spin" />
                  Verifying...
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  Verify OTP
                </Button>
              )}
              <OtpResendComp />
              <Button
                onClick={() => router.push("/signin")}
                variant="link"
                className="w-full"
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

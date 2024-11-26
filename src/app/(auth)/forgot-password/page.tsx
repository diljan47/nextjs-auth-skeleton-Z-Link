"use client";
export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import {
  resetPasswordCheckEmailAction,
  ResetPasswordCheckEmailActionResponse,
} from "./actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner"; 
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import HeaderComp from "@/app/components/HeaderComp";
import { MdEmail } from "react-icons/md";
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const router = useRouter();       
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordType) => {
    try {
      setIsLoading(true);
      const result: ResetPasswordCheckEmailActionResponse =
        await resetPasswordCheckEmailAction(data);

      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        setTimeout(() => {
          toast.success("Navigating to login page");
          router.push("/signup");
        }, 1000);
      }
    } catch (error) {
      toast.error("Something went wrong");
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                    <FormControl>
                      <Input className="text-sm sm:text-base" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button className="w-full text-sm sm:text-base" type="submit" disabled={isLoading}>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />Sending email...
                </Button>
              ) : (
                <Button className="w-full text-sm sm:text-base" type="submit">
                  <span className="flex items-center gap-2">
                    Send Email Link
                    <MdEmail className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
                  </span>
                </Button>
              )}
            </form>
          </Form>
        </div>
        <Toaster richColors position="bottom-center" duration={1500} />
      </div>
    </>
  );
};

export default ForgotPasswordPage;

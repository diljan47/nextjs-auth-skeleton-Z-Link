"use client";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? <Button className="w-full" type="submit" disabled={isLoading}><Loader2 className="animate-spin" />Sending email...</Button> :
              <Button className="w-full" type="submit" >
                Send Email Link
              </Button>
            }
          </form>
        </Form>
      </div>
      <Toaster richColors position="bottom-center" duration={1500} />

      </div>
    </>
  );
};

export default ForgotPasswordPage;

"use client";

import React, { useEffect, useState } from "react";
import { signInAction } from "./actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleauthComp from "@/app/components/GoogleauthComp";
import { Loader2 } from "lucide-react";
import HeaderComp from "@/app/components/HeaderComp";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

const SignInSchema = z.object({
  email: z.string().email(),
  hashedPassword: z.string().min(3),
});

type SignInType = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      hashedPassword: "",
    },
  });

  useEffect(() => {
    // Get query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const invalid_session = params.get('invalid_session');

    if (error) {
      if (error === "email_101") {
        toast.error(
          "This email is already registered. please sign in with your password."
        );
      } else if (error === "failed_400" || error === "failed_404") {
        toast.error("Something went wrong, please try again later");
      }
    }
    if (invalid_session) {
      toast.warning("Please sign in to continue");
    }
  }, []);

  const onSubmit = async (data: SignInType) => {
    try {
      setIsLoading(true);
      const response = await signInAction(data);
      if (response.success && response.status === 200) {
        toast.success(response.message);
        response.isEmailVerified
          ? router.push("/dashboard")
          : router.push("/verify-email");
      } else if (!response.success) {
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
        <div className="w-full max-w-md space-y-3">
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
              <FormField
                control={form.control}
                name="hashedPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button className="w-full" type="submit" disabled={isLoading}>
                  <Loader2 className="animate-spin" />Signing in...
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  <span className="flex items-center gap-1">
                    Sign In
                    <MdEmail className="w-5 h-5 text-white dark:text-black" />
                  </span>
                </Button>
              )}
              <GoogleauthComp />
            </form>
          </Form>
          <Button
            onClick={() => router.push("/signup")}
            variant="link"
            className="w-full"
          >
            Don't have an account? Sign Up
          </Button>
          <Button
            onClick={() => router.push("/forgot-password")}
            variant="link"
            className="w-full"
          >
            Forgot Password?
          </Button>
        </div>
        <Toaster richColors position="bottom-center" duration={1500} />
      </div>
    </>
  );
};

export default SignInPage;

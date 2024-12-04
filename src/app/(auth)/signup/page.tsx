"use client";

import React, { useState } from "react";
import { signupAction } from "./actions";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import GoogleauthComp from "@/app/components/GoogleauthComp";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import HeaderComp from "@/app/components/HeaderComp";

export const dynamic = "force-dynamic";

const SignUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  hashedPassword: z.string().min(3),
});

type SignUpType = z.infer<typeof SignUpSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      hashedPassword: "",
    },
  });

  const onSubmit = async (data: SignUpType) => {
    try {
      setIsLoading(true);
      const response = await signupAction(data);

      if (response.success && response.status === 200) {
        toast.success(response.message);
        router.push(response.isEmailVerified ? "/dashboard" : "/verify-email");
      }
      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An Unexpected Error Occured, Please try again later");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <HeaderComp />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  <Loader2 className="animate-spin" />
                  Signing up...
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  Sign Up
                </Button>
              )}
            </form>
          </Form>
          <Button
            onClick={() => router.push("/signin")}
            variant="link"
            className="w-full"
          >
            Already have an account? Sign In
          </Button>
          <GoogleauthComp />
        </div>
        <Toaster richColors position="bottom-center" duration={1500} />
      </div>
    </>
  );
};

export default SignUpPage;

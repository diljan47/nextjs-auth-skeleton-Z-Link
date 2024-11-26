"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateProfile } from "./actions";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .refine((value) => !/\.$/.test(value), {
      message: "Username cannot end with a period.",
    }),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  email: string | undefined;
  name: string | undefined;
  bio: string | undefined;
}

export default function ProfileForm({ email, name, bio }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentValues, setCurrentValues] = useState({
    username: name || "",
    bio: bio || "",
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: currentValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    const trimmedUsername = data.username.trim();
    const trimmedBio = data.bio?.trim() || "";

    const hasUsernameChanged = trimmedUsername !== currentValues.username;
    const hasBioChanged = trimmedBio !== currentValues.bio;

    if (!trimmedUsername) {
      toast.error("Username cannot be empty");
      setIsLoading(false);
      return;
    }

    if (!hasUsernameChanged && !hasBioChanged) {
      toast.info("No changes detected");
      setIsEditing(false);
      setIsLoading(false);
      return;
    }

    const response = await updateProfile({
      username: trimmedUsername,
      bio: trimmedBio,
    });

    if (response.success) {
      setCurrentValues({
        username: trimmedUsername,
        bio: trimmedBio,
      });
      form.reset({
        username: trimmedUsername,
        bio: trimmedBio,
      });
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    setIsEditing(false);
    setIsLoading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end ">
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="default">
            Edit Profile
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder={name || ""}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                    }}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input value={email} disabled className="bg-muted" />
            </FormControl>
            <FormDescription>
              Your email address is verified and cannot be changed here.
            </FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className={`resize-none ${!isEditing ? "bg-muted" : ""}`}
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <div className="flex gap-4">
              {isLoading ? (
                <Button type="submit">
                  <Loader2 className="animate-spin" />
                  Saving...
                </Button>
              ) : (
                <Button type="submit">Save changes</Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

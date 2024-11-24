"use server";

import { validateUserAction } from "@/app/actions/actions";
import { User } from "../../../models/User";
import { z } from "zod";
import argon2 from "argon2";
import { hashPassword } from "@/app/utils/email/password";
import { verifyPasswordHash } from "@/app/utils/email/password";
const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

type ChangePasswordType = z.infer<typeof changePasswordSchema>;
//for protected page or dashboard (seperate page)
export async function resetPasswordProtectedPageAction(
  data: ChangePasswordType
) {
  try {
    const validatedData = changePasswordSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, message: "Invalid data" };
    }
    const session = await validateUserAction();
    if (!session.success) {
      return { success: false, message: "You are not logged in" };
    }
    const user = await User.findById(session.userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    if (user.isGoogleUser) {
      return {
        success: false,
        message: "You cannot change the password for a Google account",
      };
    }

    if (data.newPassword === data.oldPassword) {
      return {
        success: false,
        message: "New password cannot be the same as the old password",
      };
    }
    if (!(await verifyPasswordHash(user.hashedPassword, data.oldPassword))) {
      return { success: false, message: "Old password is incorrect" };
    }
    user.hashedPassword = await hashPassword(data.newPassword);
    
    await user.save();

    return {
      success: true,
      message:
        "Password reset successfully, you will be redirected to the login page",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}

"use server";

import { verifyResetPasswordToken } from "@/app/utils/email/resetLink";
import User from "../../../models/User";
import { ResetPasswordCheckEmailActionResponse } from "../forgot-password/actions";
import { z } from "zod";
import { hashPassword } from "@/app/utils/email/password";

const changePasswordSchema = z.object({
  password: z.string().min(1),
});

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export async function resetPasswordTokenCheckAction(
  data: ChangePasswordType,
  token: string
): Promise<ResetPasswordCheckEmailActionResponse> {
  try {
    if (!token) {
      return { success: false, message: "Invalid token" };
    }
    const userId = await verifyResetPasswordToken(token);
    if (!userId) {
      return { success: false, message: "Invalid or expired token" };
    }
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "Invalid token or user not found" };
    }
    user.hashedPassword = await hashPassword(data.password);
    user.passwordResetToken = null;
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




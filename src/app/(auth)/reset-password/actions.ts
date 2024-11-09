"use server";

import { verifyResetPasswordToken } from "@/app/utils/email/resetLink";
import User from "../../../../models/User";
import { ResetPasswordCheckEmailActionResponse } from "../forgot-password/actions";

export async function resetPasswordTokenCheckAction(password: string,token: string): Promise<ResetPasswordCheckEmailActionResponse>  {
  try {

    const userId = await verifyResetPasswordToken(token);
    if (!userId) {
      return { success: false, message: "Invalid token" };
    }
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "Invalid token or user not found" };
    }
    user.hashedPassword = password;
    user.passwordResetToken = null;
    await user.save();
    return { success: true, message: "Password reset successfully, you will be redirected to the login page" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}

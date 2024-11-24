"use server";

import { generateResetPasswordToken } from "@/app/utils/email/resetLink";
import User from "../../../models/User";
import { sendEmailVerificationEmail } from "@/app/utils/email/emailVerification";
import emailVerificationTemplate from "@/app/utils/email/template";
import { z } from "zod";

export type ResetPasswordCheckEmailActionResponse = {
  success: boolean;
  message: string;
};

const resetPasswordCheckEmailSchema = z.object({
  email: z.string().email(),
});

type ResetPasswordCheckEmailType = z.infer<typeof resetPasswordCheckEmailSchema>;

export async function resetPasswordCheckEmailAction(
  data: ResetPasswordCheckEmailType
): Promise<ResetPasswordCheckEmailActionResponse> {
  try {
    const email  = resetPasswordCheckEmailSchema.safeParse(data); 
    if(!email.success){
      return { success: false, message: "Invalid email" };
    }
    const user = await User.findOne({ email: email.data.email });
    if (!user) {
      return { success: false, message: "Email does not exist" };
    }
    if (user && user.isGoogleUser) {
      return {
        success: false,
        message:
          "This email is registered with Google. Please use the Google login option.",
      };
    }
    const resetPasswordToken = await generateResetPasswordToken(
      user._id.toString()
    );
    user.passwordResetToken = resetPasswordToken;
    user.passwordResetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 100);
    await user.save();

    const emailResponse = await sendEmailVerificationEmail(
      user.email,
      emailVerificationTemplate.resetPasswordVerification(resetPasswordToken).subject,
      emailVerificationTemplate.resetPasswordVerification(resetPasswordToken).html
    );
    if (!emailResponse) {
      return { success: false, message: "Failed to send email" };
    }

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
}

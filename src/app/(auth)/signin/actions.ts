"use server";

import { createSession } from "@/app/utils/auth";
import { generateSessionToken } from "@/app/utils/auth";
import User from "../../../models/User";
import { setSessionTokenCookie } from "@/app/utils/session";
import { generateEmailVerificationOTP } from "@/app/utils/email/tOtp";
import { sendEmailVerificationEmail } from "@/app/utils/email/emailVerification";
import emailVerificationTemplate from "@/app/utils/email/template";
import { z } from "zod";
import argon2 from "argon2";
import { verifyPasswordHash } from "@/app/utils/email/password";
const SignInSchema = z.object({
  email: z.string().email(),
  hashedPassword: z.string().min(3),
});

type SignInType = z.infer<typeof SignInSchema>;
export async function signInAction(data: SignInType) {
  try {
    const validatedData = SignInSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, status: 400, message: "Invalid data" };
    }
    const user = await User.findOne({ email: validatedData.data.email });
    if (!user) {
      return { success: false, status: 404, message: "User not found, Please Create an account" };
    }
    
    if (user.isGoogleUser) {
      return {
        success: false,
        status: 409,
        message:
          "This email is already registered with Google,Please sign in with Google.",
      };
    }
    if (!(await verifyPasswordHash(user.hashedPassword, validatedData.data.hashedPassword))) {
      return { success: false, status: 401, message: "Invalid password" };
    }

    const sessionToken = await generateSessionToken();
    const session = await createSession(user._id.toString(), sessionToken);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    if (!user.isEmailVerified && !user.emailVerificationTOTP) {
      const emailVerificationOTP = await generateEmailVerificationOTP();

      await User.findByIdAndUpdate(user._id, {
        emailVerificationTOTP: emailVerificationOTP,
      });

      await sendEmailVerificationEmail(user.email, emailVerificationTemplate.otpVerification(emailVerificationOTP).subject, emailVerificationTemplate.otpVerification(emailVerificationOTP).html );
      return {
        success: true,
        message: "Sign in successful, Please verify your email",
        status: 200,
        name: user.name,
        email: user.email,
        sessionId: session._id?.toString(),
        isEmailVerified: user.isEmailVerified,
      };
    }
    return {
      success: true,
      message: "Sign in successful",
      status: 200,
      name: user.name,
      email: user.email,
      sessionId: session._id?.toString(),
      isEmailVerified: user.isEmailVerified,
    };
  } catch (error) {
    console.log("error", error);
    return { success: false, status: 500, message: "Internal server error" };
  }
}

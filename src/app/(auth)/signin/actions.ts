"use server";

import { createSession } from "@/app/utils/auth";
import { generateSessionToken } from "@/app/utils/auth";
import User from "../../../../models/User";
import { setSessionTokenCookie } from "@/app/utils/session";
import { generateEmailVerificationOTP } from "@/app/utils/email/tOtp";
import { sendEmailVerificationEmail } from "@/app/utils/email/emailVerification";
import emailVerificationTemplate from "@/app/utils/email/template";

export interface SignInType {
  email: string;
  hashedPassword: string;
}

export async function signInAction(data: SignInType) {
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }
    
    if (user.isGoogleUser) {
      return {
        success: false,
        status: 409,
        message:
          "This email is already registered with Google,Please sign in with Google.",
      };
    }
    if (user.hashedPassword !== data.hashedPassword) {
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
        status: 200,
        name: user.name,
        email: user.email,
        sessionId: session._id?.toString(),
        isEmailVerified: user.isEmailVerified,
      };
    }
    return {
      success: true,
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

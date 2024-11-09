"use server";

import { createSession, generateSessionToken } from "@/app/utils/auth";
import { setSessionTokenCookie } from "@/app/utils/session";
import mongoose from "mongoose";
import User from "../../../../models/User";
import { IUser } from "../../../../models/User";
import { generateEmailVerificationOTP } from "@/app/utils/email/tOtp";
import { sendEmailVerificationEmail } from "@/app/utils/email/emailVerification";
import emailVerificationTemplate from "@/app/utils/email/template";

interface SignupResponse {
  success: boolean;
  status?: number;
  userId?: mongoose.Schema.Types.ObjectId;
  message?: string;
  name?: string;
  email?: string;
  isEmailVerified?: boolean;
  isGoogleUser?: boolean;
}

export const signupAction = async (
  userData: IUser
): Promise<SignupResponse> => {
  try {
    if (!userData) {
      return { success: false, message: "No user data provided" };
    }

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      if (existingUser.isGoogleUser) {
        return {
          success: false,
          status: 409,
          message:
            "This email is already registered with Google. Please sign in with Google.",
        };
      } else {
        return {
          success: false,
          status: 409,
          message:
            "This email is already registered. Please sign in with your password.",
        };
      }
    }
    let newUser;
    if(!userData.isGoogleUser){
    //email verification
    const emailVerificationOTP = await generateEmailVerificationOTP();

     newUser = await User.create({
      ...userData,
      emailVerificationTOTP: emailVerificationOTP,
      
    });
  
    
    const emailSent = await sendEmailVerificationEmail(
      newUser.email,
      emailVerificationTemplate.otpVerification(emailVerificationOTP).subject,
      emailVerificationTemplate.otpVerification(emailVerificationOTP).html
      );
    
    
    //
    if (!emailSent || emailSent.error) {
      await User.deleteOne({ _id: newUser._id });
      return {
        success: false,
        status: 500,
        message: "Failed to send verification email. Please try again.",
      };
    }
  }
    else{
      newUser = await User.create({
        ...userData,
        isEmailVerified: true,

      });
    }

    const sessionToken = await generateSessionToken();
    const session = await createSession(newUser._id.toString(), sessionToken);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return {
      success: true,
      status: 200,
      name: newUser.name,
      email: newUser.email,
    };
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

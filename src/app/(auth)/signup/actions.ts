"use server";

import { createSession, generateSessionToken } from "@/app/utils/auth";
import { setSessionTokenCookie } from "@/app/utils/session";
import mongoose from "mongoose";
import User from "../../../models/User";
import { generateEmailVerificationOTP } from "@/app/utils/email/tOtp";
import { sendEmailVerificationEmail } from "@/app/utils/email/emailVerification";
import emailVerificationTemplate from "@/app/utils/email/template";
import { z } from "zod";
import { hashPassword } from "@/app/utils/email/password";

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

interface SignUpGoogleResponse {
  success: boolean;
  userId?: mongoose.Schema.Types.ObjectId;
  message?: string;
}

const SignUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  hashedPassword: z.string().min(3),
});

type SignUpType = z.infer<typeof SignUpSchema>;

const SignUpGoogleSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  isGoogleUser: z.boolean(),
  isEmailVerified: z.boolean(),
});

type SignUpGoogleType = z.infer<typeof SignUpGoogleSchema>;

export const signupAction = async (
  userData: SignUpType
): Promise<SignupResponse> => {
  try {
    const validatedData = SignUpSchema.safeParse(userData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
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
    if (existingUser === null || existingUser.isEmailVerified === false) {
      //email verification
      const emailVerificationOTP = await generateEmailVerificationOTP();

      newUser = await User.create({
        ...userData,
        hashedPassword: await hashPassword(userData.hashedPassword),
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
    } else {
      newUser = await User.create({
        ...userData,
        hashedPassword: await hashPassword(userData.hashedPassword),
        isEmailVerified: true,
      });
    }

    const sessionToken = await generateSessionToken();
    const session = await createSession(newUser._id.toString(), sessionToken);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return {
      success: true,
      message: "Signup successful",
      status: 200,
      name: newUser.name,
      email: newUser.email,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "An Unexpected Error Occured, Please try again later",
    };
  }
};

export const signupGoogleAction = async (
  userData: SignUpGoogleType
): Promise<SignUpGoogleResponse> => {
  try {
    const validatedData = SignUpGoogleSchema.safeParse(userData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser && !existingUser.isGoogleUser) {
      return {
        success: false,
        message:
          "This email is already registered. please sign in with your password.",
      };
    }
    const newUser = await User.create(userData);
    if (!newUser) {
      return {
        success: false,
        message: "Failed to create user",
      };
    }


    return {
      success: true,
      message: "Signup successful",
      userId: newUser._id.toString(),
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      
      success: false,
      message: "An Unexpected Error Occured, Please try again later",
    };
  }
};

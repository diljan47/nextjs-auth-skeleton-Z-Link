"use server";

import {
  createSession,
  generateSessionToken,
} from "@/app/utils/auth";
import { setSessionTokenCookie } from "@/app/utils/session";
import mongoose from "mongoose";
import User from "../../../../models/User";
import { IUser } from "../../../../models/User";

interface SignupResponse {
  success: boolean;
  status?: number;
  userId?: mongoose.Schema.Types.ObjectId;
  message?: string;
  name?: string;
  email?: string;
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
          message: "This email is already registered with Google. Please sign in with Google.",
        };
      } else {
        return {
          success: false,
          status: 409,
          message: "This email is already registered. Please sign in with your password.",
        };
      }
    }

    const newUser = await User.create(userData);
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

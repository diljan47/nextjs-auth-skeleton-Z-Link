"use server";

import { createSession } from "@/app/utils/auth";
import { generateSessionToken } from "@/app/utils/auth";
import User from "../../../../models/User";
import { setSessionTokenCookie } from "@/app/utils/session";

export interface SignInType {
  email: string;
  hashedPassword: string;
}

export async function signInAction(data: SignInType) {

  const user = await User.findOne({ email: data.email });
  if (!user) {
    return { success: false, status: 404, message: "User not found" };
  }
  if(user.isGoogleUser){
    return {success:false,status:400,message:"This email is already registered with Google,Please sign in with Google."}
  }
  if (user.hashedPassword !== data.hashedPassword) {
    return { success: false, status: 401, message: "Invalid password" };
  }
  const sessionToken = await generateSessionToken();
  const session = await createSession(user._id.toString(), sessionToken);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return {
    success: true,
    status: 200,
    name: user.name,
    email: user.email,
    sessionId: session._id?.toString(),
  };
}

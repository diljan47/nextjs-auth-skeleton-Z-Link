"use server";

import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import mongoose from "mongoose";
import Session, { ISession } from "../../models/Session";
import User from "../../models/User";
import { cookies } from "next/headers";
import { deleteCookieAction, logOutAction } from "../actions/actions";
import { getSessionToken } from "./session";
export interface SessionValidationResult {
  success: boolean;
  userId?: string;
  sessionExpires?: Date;
  message?: string;
  name?: string;
  email?: string;
  isGoogleUser?: boolean;
  bio?: string;
}

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  await crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  userId: mongoose.Schema.Types.ObjectId,
  token: string
): Promise<ISession> {
  try {
    await Session.deleteOne({ userId });

    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    const session: ISession = {
      userId,
      sessionToken: sessionId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    const result = await Session.create(session);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Helper function to handle session deletion
async function handleSessionDeletion(sessionId: string): Promise<void> {
  await Session.deleteOne({ sessionToken: sessionId });

}


export async function validateSession(): Promise<SessionValidationResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    if (!token) {
      return { success: false, message: "No session cookie found" };
    }

    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    );
    
    const session = await Session.findOne({ sessionToken: sessionId });
    
    if (!session) {
      return { success: false, message: "Invalid session" };
    }
    
    
    const user = await User.findById(session.userId);
    
    
    if (!user) {
      console.log("User not found deleting session");
      
      return { success: false, message: "User not found deleting session" };
    }

    if (Date.now() >= session.expiresAt.getTime()) {
      await handleSessionDeletion(sessionId);
      return { success: false, message: "Session expired" };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await session.save();
    }

    return {
      success: true,
      userId: user._id.toString(),
      sessionExpires: session.expiresAt,
      name: user.name,
      email: user.email,
      isGoogleUser: user.isGoogleUser,
      bio: user.bio,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    return {
      success: false,
      message: "Failed to validate session",
    };
  }
}

export async function invalidateSessionByToken(
  sessionToken: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken))
    );

    const result = await Session.deleteOne({ sessionToken: sessionId });
    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "Session not found",
      };
    }
    console.log(`Session with token ${sessionToken} invalidated`);
    return { success: true, message: "Session invalidated" };
  } catch (error) {
    console.log("Failed to invalidate session:", error);
    return {
      success: false,
      message: "Failed to invalidate session",
    };
  }
}

// export async function invalidateAllSessionsForUser(
//   userId: mongoose.Schema.Types.ObjectId
// ): Promise<void> {
//   await Session.deleteMany({ userId });
//   await deleteCookieAction();
//   console.log(`All sessions for user ${userId} invalidated`);
// }








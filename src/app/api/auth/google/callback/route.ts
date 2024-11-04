"use server";

import { googleOAuthClient } from "@/app/utils/googleOauth";
import { decodeIdToken, OAuth2Tokens } from "arctic";
import { cookies } from "next/dist/server/request/cookies";
import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "../../../../../../models/User";
import { signupAction } from "@/app/(auth)/signup/actions";
import { createSession } from "@/app/utils/auth";
import { generateSessionToken } from "@/app/utils/auth";
import { setSessionTokenCookie } from "@/app/utils/session";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      console.log("No code or state");
      return new Response(null, { status: 400 });
    }
    const cookiesStore = await cookies();
    const codeVerifier = cookiesStore.get("google_code_verifier")?.value;
    const googleState = cookiesStore.get("google_state")?.value;

    if (!codeVerifier || !googleState) {
      console.log("No codeVerifier or googleState");
      return new Response(null, { status: 400 });
    }
    if (state !== googleState) {
      console.log("State does not match");
      return new Response(null, { status: 400 });
    }
    let tokens: OAuth2Tokens;
    try {
      tokens = await googleOAuthClient.validateAuthorizationCode(
        code,
        codeVerifier
      );
    } catch (error) {
      console.log(error);
      return new Response(null, { status: 400 });
    }
    const claims = decodeIdToken(tokens.idToken());
    const parsedClaims = claims as {
      sub: string;
      name: string;
      email: string;
    };
    const googleUserId = parsedClaims.sub;
    const username = parsedClaims.name;
    const email = parsedClaims.email;

    const existingUser = await User.findOne({ email });

    if (existingUser !== null) {
      if (!existingUser.isGoogleUser) {
        return Response.json(
          { error: "User already exists and is not a Google user" },
          { status: 400 }
        ); 
      }
      const sessionToken = await generateSessionToken();
      const session = await createSession(existingUser._id, sessionToken);
      await setSessionTokenCookie(sessionToken, session.expiresAt);
      return new Response(null, { status: 302, headers: { Location: "/" } });
    }
    const createdUser = await signupAction({
      name: username,
      email,
      isGoogleUser: true,
    });
    if (!createdUser.success) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/signin" },
      });
    }
    return new Response(null, { status: 302, headers: { Location: "/" } });
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 302, headers: { Location: "/signin" } });
  }
}

"use server";

import { googleOAuthClient } from "@/app/utils/googleOauth";
import { decodeIdToken, OAuth2Tokens } from "arctic";
import { cookies } from "next/dist/server/request/cookies";
import { NextRequest } from "next/server";
import User from "../../../../../models/User";
import { signupGoogleAction } from "@/app/(auth)/signup/actions";
import { createSession } from "@/app/utils/auth";
import { generateSessionToken } from "@/app/utils/auth";
import { setSessionTokenCookie } from "@/app/utils/session";
import { deleteCookieAction } from "@/app/actions/actions";

export async function GET(request: NextRequest) {
  console.log("Google callback route");
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
    if (existingUser) {
      if (!existingUser.isGoogleUser) {
        // await deleteCookieAction();
        return new Response(null, {
          status: 302,
          headers: { Location: "/signin?error=email_101" },
        });
      }
      const sessionToken = await generateSessionToken();
      const session = await createSession(
        existingUser._id.toString(),
        sessionToken
      );
      await setSessionTokenCookie(sessionToken, session.expiresAt);
      return new Response(null, { status: 302, headers: { Location: "/" } });
    }

    const createdUser = await signupGoogleAction({
      name: username,
      email,
      isGoogleUser: true,
      isEmailVerified: true,
    });
    if(createdUser.success && createdUser.userId){
    
    const sessionToken = await generateSessionToken();
    const session = await createSession(createdUser.userId, sessionToken);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return new Response(null, { status: 302, headers: { Location: "/" } });
    }
    return new Response(null, {
      status: 302,
      headers: { Location: "/signin?error=failed_400" },
    });
  } catch (error) {
    await deleteCookieAction();
    return new Response(null, {
      status: 302,
      headers: { Location: "/signin?error=failed_404" },
    });
  }
}

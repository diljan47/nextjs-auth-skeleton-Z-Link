"use server";

import { cookies } from "next/headers";
import { invalidateSessionByToken, validateSession } from "../utils/auth";
import { redirect } from "next/navigation";
import { getSessionToken } from "../utils/session";

export async function deleteCookieAction() {
  const cookiesStore = await cookies();
  cookiesStore.getAll().forEach((cookie) => {
    cookiesStore.delete(cookie.name);
  });
}

export async function validateUserAction() {
  const session = await validateSession();
  if (!session.success) {
    redirect("/signin?invalid_session=true");

  }
  return session;
}

export async function validateClientUserAction() {
  const session = await validateSession();
  if (!session.success) {
    redirect("/signin");
  }
  return {
    success: session.success,
    sessionExpires: session.sessionExpires,
    message: session.message,
    name: session.name,
    email: session.email,
    isGoogleUser: session.isGoogleUser,
    bio: session.bio,
  };
}

export async function invalidateSessionAction(sessionToken: string) {
  const session = await invalidateSessionByToken(sessionToken);
  if (!session.success) {
    redirect("/signin");
  }
  return session;
}

export async function logOutAction() {
  const session = await getSessionToken();
  await invalidateSessionAction(session.token);
  await deleteCookieAction();
  return { success: true };
}

//   try {
//     const cookiesStore = await cookies();
//     const sessionToken = cookiesStore.get("session")?.value;

//     if (sessionToken) {
//       const result = await invalidateSessionByToken(sessionToken);
//       await deleteCookieApi();
//       return result;
//     }
//     redirect("/signin");

//   } catch (error) {
//     console.error("Logout error:", error);
//     redirect("/signin");
//     return {
//       success: false,
//       message: "Error during logout"
//     };
//   }
// }

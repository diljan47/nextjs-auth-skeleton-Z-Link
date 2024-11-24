"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
    const cookiesData = await cookies();

	cookiesData.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		path: "/",
		priority: "high"
	});
}

export async function getSessionToken(): Promise<{success: boolean, message: string, token: string}>{
  const cookiesData = await cookies();
  const token = cookiesData.get("session")?.value || "";
  if(!token){
	// revalidatePath("/");
	return {success: false, message: "No session token found", token: ""};
  }
  return {success: true, message: "Session token found", token: token};
}


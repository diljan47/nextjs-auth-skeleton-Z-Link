"use server";

import { cookies } from "next/headers";
import { invalidateSessionByToken, validateSession } from "../utils/auth";
import { redirect } from "next/navigation";


export async function deleteCookieAction(){
  const cookiesStore = await cookies();
  cookiesStore.delete("session");
  cookiesStore.delete("google_code_verifier");
  cookiesStore.delete("google_state");
}

export async function validateUserAction(){
  const session = await validateSession();
  if(!session.success){
    redirect("/signin");
  }
  return session;
}

export async function invalidateSessionAction(sessionToken: string){
  const session = await invalidateSessionByToken(sessionToken);
  if(!session.success){
    redirect("/signin");
  }
  return session;
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
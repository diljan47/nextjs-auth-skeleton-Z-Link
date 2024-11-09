"use server";

import { jwtVerify } from "jose";

import { SignJWT } from "jose";

export async function generateResetPasswordToken(userId:string): Promise<string>{
    const secret = new TextEncoder().encode(process.env.JWT_RESET_PASSWORD_SECRET!);
    const token = await new SignJWT({userId}).setProtectedHeader({alg:"HS256"}).setExpirationTime("15m").setIssuedAt().sign(secret);
    return token;
  }
  
  export async function verifyResetPasswordToken(token:string): Promise<string | null>{
    try{
      const secret = new TextEncoder().encode(process.env.JWT_RESET_PASSWORD_SECRET!);
      const {payload} = await jwtVerify(token, secret);
      return payload.userId as string;
    }catch(error:any){
      console.log("error", error);
      return null;
    }
  } 
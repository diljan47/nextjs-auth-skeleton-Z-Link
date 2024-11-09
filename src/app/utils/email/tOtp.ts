"use server";

import { generateTOTP, verifyTOTP } from "@oslojs/otp";
import { sendEmailVerificationEmail } from "./emailVerification";
import emailVerificationTemplate from "./template";

const digits: number = 6;
const intervalInSeconds: number = 300;



export async function generateEmailVerificationOTP(): Promise<string> {
  const totp = await generateTOTP(
    new TextEncoder().encode(process.env.OTP_SECRET!),
    intervalInSeconds,
    digits
  );
  return totp;
}

export async function resendEmailVerificationOTP(to: string, otp: string): Promise<boolean> {
  const data = await sendEmailVerificationEmail(to, emailVerificationTemplate.otpVerification(otp).subject, emailVerificationTemplate.otpVerification(otp).html);
  if(data){
    return true;
  }
  return false;  
}


export async function verifyEmailVerificationOTP(otp: string): Promise<boolean> {
  const isValid = await verifyTOTP(
    new TextEncoder().encode(process.env.OTP_SECRET!),
    intervalInSeconds,
    digits,
    otp
  );
  
  return isValid;
}

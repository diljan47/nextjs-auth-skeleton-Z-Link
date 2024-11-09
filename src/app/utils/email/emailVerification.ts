"use server";

import { CreateEmailResponse, Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);




export async function sendEmailVerificationEmail(
  to: string,
  subject: string,
  html: string
): Promise<CreateEmailResponse | undefined> {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });
    return data;
    
  } catch (error) {
    console.error("Error sending email verification email", error);
    return undefined;
  }
}

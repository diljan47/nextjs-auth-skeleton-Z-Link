"use server";

import { validateUserAction } from "@/app/actions/actions";
import { generateEmailVerificationOTP, resendEmailVerificationOTP, verifyEmailVerificationOTP } from "@/app/utils/email/tOtp";
import User from "../../../models/User";
import { redirect } from "next/navigation";
import { z } from "zod";
type VerifyEmailVerificationActionResponse = {
  success: boolean;
  message: string;
};

const VerifyEmailSchema = z.object({
  otp: z.string().min(6),
});

type VerifyEmailType = z.infer<typeof VerifyEmailSchema>;

export async function verifyEmailVerificationAction(
  data: VerifyEmailType
): Promise<VerifyEmailVerificationActionResponse> {
  try {

    const session = await validateUserAction();
    
    if (!session.success) {
      redirect("/signin");  
      
    }
    const user = await User.findById(session.userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    if(!user.emailVerificationTOTP){
      return {
        success: false,
        message: "OTP not found in db",
      };
    }

    
    const isValid = await verifyEmailVerificationOTP(data.otp);
    
    if (!isValid) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      };
    }

    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationTOTP: null,
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.error("Error verifying email verification OTP:", error);
    return {
      success: false,
      message: "Error verifying email verification OTP",
    };
  }
}

export async function resendEmailVerificationOTPAction(): Promise<VerifyEmailVerificationActionResponse> {
  try{
    const session = await validateUserAction();
    if (!session.success) {
      redirect("/signin");  
    }
    const user = await User.findById(session.userId);
    if (!user) {
      redirect("/signin");
    }
    const newOtp = await generateEmailVerificationOTP();
    user.emailVerificationTOTP = newOtp;
    await user.save(); 

    if (await resendEmailVerificationOTP(user.email, newOtp)) {
      return {
      success: true,
      message: "OTP resent successfully",
    };
  }
  return {
    success: false,
      message: "Error resending OTP",
    };
  } catch (error) {
    console.error("Error resending email verification OTP:", error);
    return {
      success: false,
      message: "Error resending email verification OTP",
    };
  }
}

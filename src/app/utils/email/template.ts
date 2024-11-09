
const emailVerificationTemplate = {
  otpVerification: (otp: string) => ({
    subject: "Email Verification",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<p>Thank you for signing up! Please use the following verification code to verify your email address:</p>
<div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
  <strong>${otp}</strong>
</div>
<p>This code will expire in 5 minutes.</p>
<p>If you didn't request this verification, please ignore this email.</p>
<p>Best regards,<br>Your App Team</p>
</div>`,
  }),

  resetPasswordVerification: (token: string) => ({
    subject: "Reset Password",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <p>Please click the following link to reset your password: <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}">Reset Password</a></p>
    </div>`,
  }),
};

export default emailVerificationTemplate;

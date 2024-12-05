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
<p>Best regards,<br>Z-Link Auth Team</p>
</div>`,
  }),

  resetPasswordVerification: (token: string) => ({
    subject: "Reset Password",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Z-Link</h1>
      <p style="color: #374151; font-size: 16px; line-height: 24px;">We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}" 
           style="display: inline-block; background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; transition: background-color 0.2s;">
          Reset Password
        </a>
      </div>
      <p style="color: #6B7280; font-size: 14px;">This link will expire in 15 minutes.</p>
      <p style="color: #6B7280; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="color: #374151; font-size: 14px; margin: 0;">Best regards,<br>Z-Link Team</p>
      </div>
      <div style="margin-top: 20px; text-align: center; color: #6B7280; font-size: 12px;">
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4F46E5;">${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}</p>
      </div>
    </div>`,
  }),
};

export default emailVerificationTemplate;

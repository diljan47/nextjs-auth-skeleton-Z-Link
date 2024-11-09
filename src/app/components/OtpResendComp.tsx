"use client";

import React, { useState } from 'react'
import { resendEmailVerificationOTPAction } from '../(auth)/verify-email/actions';

const OtpResendComp = () => {
    const [result, setResult] = useState({success: false, message: ""});
    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await resendEmailVerificationOTPAction();
        setResult(result);
      }
  return (
    <div className='flex flex-col gap-4 m-auto mt-4 p-2 w-1/2 '>
      <button onClick={handleResend}    className='bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded'>Resend OTP</button>
      {result.success && <p className='text-green-500'>{result.message}</p>}
      {!result.success && <p className='text-red-500'>{result.message}</p>}
    </div>
  )
}

export default OtpResendComp
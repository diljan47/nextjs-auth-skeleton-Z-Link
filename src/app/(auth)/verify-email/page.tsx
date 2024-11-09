"use client";

import OtpResendComp from "@/app/components/OtpResendComp";
import {  verifyEmailVerificationAction } from "./actions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState({ success: false, message: "" });
  const router = useRouter();
  
  useEffect(()=>{
    if (result.success) {
      router.push("/");
    }

  },[result.success,router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyEmailVerificationAction(otp);
    
    setResult(result);
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Verify Your Email
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Please enter the verification code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter verification code"
            maxLength={6}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Verify Email
          </button>
        </form>
        {!result.success && <p className="text-red-500">{result.message}</p>}
       <OtpResendComp />  
      </div>
    </div>
  );
};

export default VerifyEmailPage;

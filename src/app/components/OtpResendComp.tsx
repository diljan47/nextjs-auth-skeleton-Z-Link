"use client";

import React, { useState, useEffect } from "react";
import { resendEmailVerificationOTPAction } from "../(auth)/verify-email/actions";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { Loader, Loader2 } from "lucide-react";

const OtpResendComp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!canResend) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 30; // Reset timer for next use
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [canResend]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await resendEmailVerificationOTPAction();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
    setCanResend(false); // Disable button and start timer again
  };

  return (
    <div className="flex flex-col gap-4 m-auto mt-4 p-2 w-1/2 ">
      <Button
        onClick={handleResend}
        disabled={!canResend}
        variant="default"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Resending OTP
          </>
        ) : (
          `Resend OTP ${!canResend ? `(${timer}s)` : ""}`
        )}
      </Button>
    </div>
  );
};

export default OtpResendComp;

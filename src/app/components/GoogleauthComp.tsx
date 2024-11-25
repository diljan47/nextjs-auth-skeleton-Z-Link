"use client";
import React from "react";
import { getGoogleOauthConsentUrl } from "../actions/google.auth";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

type GoogleAuthResult = {
  success: boolean;
  url?: string;
  error?: string;
};

const GoogleauthComp = () => {
  const handleGoogleAuth = async () => {
    const result: GoogleAuthResult = await getGoogleOauthConsentUrl();
    if (result.success && result.url) {
      window.location.href = result.url;
      if (result.error) {
        alert(`Error: ${result.error}`);
      }
    } else {
      console.log("Error getting Google OAuth consent URL");
    }
  };
  return (
    <Button type="button"  className="w-full bg-slate-200 text-black hover:bg-gray-300 no-underline hover:no-underline" onClick={handleGoogleAuth}>
      <span className="flex items-center gap-1">
        Sign in with Google
        <FaGoogle className="w-4 h-4 ml-1 " />
      </span>
    </Button>
  );
};

export default GoogleauthComp;

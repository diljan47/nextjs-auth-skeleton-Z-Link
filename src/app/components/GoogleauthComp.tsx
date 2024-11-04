"use client";
import React from "react";
import { getGoogleOauthConsentUrl } from "../actions/google.auth";

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
    <div>
      <button
        className="bg-blue-500 m-auto flex float-end text-white p-2 rounded-md"
        onClick={handleGoogleAuth}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleauthComp;

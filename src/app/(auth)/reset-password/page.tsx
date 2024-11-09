"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPasswordCheckEmailActionResponse } from "../forgot-password/actions";
import { resetPasswordTokenCheckAction } from "./actions";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [response, setResponse] =
    useState<ResetPasswordCheckEmailActionResponse>({
      success: false,
      message: "",
    });
  useEffect(() => {
    if (!token || token === "") {
      setResponse({ success: false, message: "Invalid token" });
      setTimeout(() => {
        setResponse({ success: false, message: "Navigating to login page" });
        router.push("/signup");
      }, 3000);
    }
  }, [token, router]);
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (password === "" || confirmPassword === "") {
      return setResponse({
        success: false,
        message: "Password cannot be empty",
      });
    }
    if (password !== confirmPassword) {
        return setResponse({
          success: false,
          message: "Passwords do not match",
        });
    }
    const response = await resetPasswordTokenCheckAction(password, token);
    setResponse(response);
    if (response.success) {
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <p className="text-sm text-gray-500">
        Please enter your new password below.
      </p>
      <form className="flex flex-col items-center justify-center gap-4">
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="New Password"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          placeholder="Confirm Password"
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={handleSubmit}
        >
          Reset Password
        </button>
        {response.message && <p className="text-red-500">{response.message}</p>}
      </form>
    </div>
  );
};

export default page;

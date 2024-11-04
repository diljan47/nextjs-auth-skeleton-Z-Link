"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction, SignInType } from "./actions";
import Link from "next/link";
import GoogleauthComp from "@/app/components/GoogleauthComp";

const page = () => {
  const router = useRouter();
  const [data, setData] = useState<SignInType>({
    email: "",
    hashedPassword: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultData: SignInType = {
      email: e.currentTarget.email.value,
      hashedPassword: e.currentTarget.password.value,
    };

    if (resultData.email && resultData.hashedPassword) {
      const response = await signInAction(resultData);
      if (response.success && response.status === 200) {
        router.push("/");
      } else if (response.success === false && response.status === 404) {
        router.push("/signup");
      } else if (response.success === false && response.status === 401) {
        console.log(response.message);
      } else {
        router.push("/signin");
      }
    }
  };
  return (
    <div className="flex flex-col gap-4 mt-10">
      <div className="text-2xl font-bold m-auto" >Sign In Page</div>
      <GoogleauthComp />
      <form className="flex flex-col p-4 rounded-md" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
        className="p-2 rounded-md bg-slate-200 active:border-slate-700"
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
        className="p-2 rounded-md bg-slate-200 active:border-slate-700"
          type="password"
          name="password"
          value={data.hashedPassword}
          onChange={(e) => setData({ ...data, hashedPassword: e.target.value })}
        />
        <button className="bg-slate-500 mt-4 text-white p-4 rounded-md font-bold m-auto hover:bg-slate-700" type="submit">Sign In</button>
      <Link className="text-2xl mt-5 bg-slate-500 text-white p-2 rounded-md font-bold m-auto hover:underline" href="/signup">Sign Up</Link>
      </form>
    </div>
  );
};

export default page;

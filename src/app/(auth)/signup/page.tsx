"use client";
import React, { useState } from "react";
import { signupAction } from "./actions";
import { IUser } from "../../../../models/User";
import { redirect } from "next/navigation";
import Link from "next/link";

const page = () => {
  const [data, setData] = useState<IUser>({
    name: "",
    email: "",
    hashedPassword: "",
  });
  const [error, setError] = useState<string | undefined>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultData: IUser = {
      name: e.currentTarget.username.value,
      email: e.currentTarget.email.value,
      hashedPassword: e.currentTarget.password.value,
    };

    if (resultData.name && resultData.email && resultData.hashedPassword) {
      const response = await signupAction(resultData);
      
      if(response.success && response.status === 200){
        response.isEmailVerified ? redirect("/") : redirect("/verify-email");
      }
      if (response.status === 409) {
        console.log("email already exists in database");
        redirect("/signin");
      }
    }
  };
  return (
    <div className="flex flex-col m-auto items-center justify-center h-screen ">
      <div className="text-2xl font-bold  flex-start mb-4" >Sign Up Page</div>

      <form className="flex flex-col  items-center justify-center gap-4" onSubmit={handleSubmit}>
        <label className="text-sm flex-start " htmlFor="username">Name</label>
        <input
          className="p-2 rounded-md bg-slate-200 active:border-slate-700"
          type="text"
          name="username"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <label className="text-sm" htmlFor="email">Email</label>
        <input
          className="p-2 rounded-md bg-slate-200 active:border-slate-700"
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label className="text-sm" htmlFor="password">Password</label>
        <input
          className="p-2 rounded-md bg-slate-200 active:border-slate-700"
          type="password"
          name="password"
          value={data.hashedPassword}
          onChange={(e) => setData({ ...data, hashedPassword: e.target.value })}
        />
        {error && <div className="text-red-500">{error}</div>}
        <button className="bg-slate-500 mt-4 text-white p-4 rounded-md font-bold m-auto hover:bg-slate-700" type="submit">Signup</button>
      <Link className=" bg-slate-500 p-2  rounded-md font-bold m-auto hover:underline" href="/signin">Sign In</Link>

      </form>

    </div>
  );
};

export default page;

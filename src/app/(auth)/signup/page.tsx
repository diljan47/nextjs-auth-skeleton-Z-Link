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
        redirect("/");
      }
      if (response.status === 409) {
        console.log("email already exists in database");
        redirect("/signin");
      }
    }
  };
  return (
    <div>
      <div className="text-2xl font-bold m-auto flex flex-col" >Sign Up Page</div>
      <Link className=" bg-slate-500 p-2  rounded-md font-bold m-auto hover:underline" href="/signin">Sign In</Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Name</label>
        <input
          type="text"
          name="username"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={data.hashedPassword}
          onChange={(e) => setData({ ...data, hashedPassword: e.target.value })}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default page;

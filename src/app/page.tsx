"use server";

import { LogoutButton } from "./components/LogoutButton";
import { validateUserAction } from "./actions/actions";
import ValidateUserComp from "./components/ValidateUserComp";
import InvalidateComp from "./components/InvalidateComp";
import { redirect } from "next/navigation";



export default async function Home() {
  const session = await validateUserAction();
  if(!session.success){
    redirect("/signin");
  }
  

  return (
    <div className="m-auto flex flex-col gap-4 mt-10">
      <h1>Welcome {session.name}</h1>  
     {session.success && <LogoutButton  /> }
     {session.success && <ValidateUserComp />}
     {session.success && <InvalidateComp />}
    </div>
  );
}

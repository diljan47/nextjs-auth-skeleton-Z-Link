"use client";

import {  invalidateSessionAction, } from "../actions/actions";
import { getSessionToken } from "../utils/session";



export  function LogoutButton() {
const handleLogout = async ()=>{
  const token = await getSessionToken();
  if(token.success){
    await invalidateSessionAction(token.token);
  } 
  // redirect("/signin");
}
  
  
  return (
    <button
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

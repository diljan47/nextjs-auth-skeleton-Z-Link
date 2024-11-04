"use client";
import React, { useState } from 'react'
import { validateUserAction } from '../actions/actions';
import { SessionValidationResult } from '../utils/auth';

const ValidateUserComp = () => {
  const [session, setSession] = useState<SessionValidationResult | null>(null);
  const handleValidate = async ()=>{
    const session = await validateUserAction();
    setSession(session);
  }
  

  return (
    <div className='flex m-auto flex-col gap-4'>
      {session?.success && <h1 className='text-2xl font-bold m-auto'>Welcome {session.name}</h1>}
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleValidate}>Validate User</button>  
       </div>
  )
}

export default ValidateUserComp

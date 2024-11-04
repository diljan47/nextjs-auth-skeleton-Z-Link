"use client";
import React, { useState } from 'react'
import { invalidateSessionAction } from '../actions/actions';
import { getSessionToken } from '../utils/session';



const InvalidateComp = () => {
    const [session, setSession] = useState<{success: boolean, message?: string} | null>(null);
  const handleInvalidate = async ()=>{
    const sessionToken = await getSessionToken();
    if(sessionToken.success){
      await invalidateSessionAction(sessionToken.token);
      setSession({success: true, message: "Session invalidated"});
    }else{
    
      setSession({success: false});
    }
  }
  return (
    <div className='flex m-auto flex-col gap-4'>
        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={handleInvalidate}>Invalidate Session</button>
        {session && <p>{session.message}</p>}
    </div>
  )
}

export default InvalidateComp
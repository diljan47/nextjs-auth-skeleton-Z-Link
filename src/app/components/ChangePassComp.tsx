"use client";


import { useRouter } from 'next/navigation';
import React from 'react'

const ChangePassComp = () => {
  const router = useRouter();
  return (
    <div className='flex justify-end mr-10 hover:cursor-pointer '>
        <button className='bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md' onClick={()=>router.push("/change-password")}>Change Password</button>
    </div>
  )
}

export default ChangePassComp
"use client"

import React, { useState } from 'react'
import { resetPasswordCheckEmailAction, ResetPasswordCheckEmailActionResponse } from './actions';

const forgotPasswordPage = () => {
    const [email, setEmail] = useState<string>("");
    const [response, setResponse] = useState <ResetPasswordCheckEmailActionResponse>({success: false, message: ""});

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!email){
            return setResponse({success: false, message: "Email is required"});
        }
        const response = await resetPasswordCheckEmailAction(email);
        setResponse(response);
        if(!response.success){
            setEmail("");
            return setResponse({success: false, message: response.message});
        }
        setEmail("");
        
    }
    return (
       <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <h1 className='text-2xl font-bold'>Enter your email to reset your password</h1>
        <form className='flex flex-col items-center justify-center gap-4'>
            <input className='border-2 border-gray-300 rounded-md p-2' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className='bg-blue-500  text-white p-2 rounded-md'  type="submit"  onClick={handleSubmit}>Send Email Link</button>
        </form>
        {response.message && <p className='text-red-500'>{response.message}</p>}
       </div>
      );
}

export default forgotPasswordPage;

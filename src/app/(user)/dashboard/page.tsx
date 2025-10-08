'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const Page = () => {
  const { data: session, status } = useSession(); // session has user info
  return (
    <>
    <div className='h-screen bg-black text-white'>
      <div className='  flex justify-center '>Hi {session?.user.name}</div>
     This screen is dark, cold… just like your career path after that choosing AJIET.
    </div>
      
    </>
  )
}

export default Page
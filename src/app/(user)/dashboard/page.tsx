'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const Page = () => {
  const { data: session, status } = useSession(); // session has user info      // user is not authenticated

  return (
    
    <>
    <div className='h-screen bg-background '>
      <div className='  flex justify-center '>Hi {session?.user.name}</div>
     This screen is dark, just like your career path after choosing AJIET.
    </div>
    </>
  )
}

export default Page
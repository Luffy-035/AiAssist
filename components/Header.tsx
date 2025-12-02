import React from 'react'
import Link from 'next/link'
import Avatar from './Avatar'
import { UserButton,SignInButton,SignedIn,SignedOut } from '@clerk/nextjs'

const Header = () => {
  return (
    <>
        <header className='bg-white shadow-sm flex justify-between p-5 text-gray-800'>
           
            <Link href='/' className='flex items-center gap-3 text-4xl font-thin'>
            <Avatar seed='Lakshya Agarwal'/>
            <div className='space-y-1'>
                <h1>AiAssist</h1>
                <h2 className='text-sm'>Your super duper AI Assistant</h2>
            </div>
            </Link>

            <div className='flex items-center'>
                <SignedIn>
                    <UserButton showName />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>

        </header>
    </>
  )
}

export default Header

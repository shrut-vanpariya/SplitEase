// 'use client'

import { LoginAccount } from '@/components/login-account'

export default function Page() {
    return (
        <>
            <main className='flex flex-col bg-background justify-center items-center min-h-screen w-full'>
                <LoginAccount />
            </main>
        </>
    )
}


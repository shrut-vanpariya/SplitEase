'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import { AvatarDrop } from './AvatarDrop';
import { useSession } from 'next-auth/react';
import { SheetMenu } from "@/components/admin-panel/sheet-menu";


const Navbar = () => {

    const { data: session, status } = useSession();


    return (
        <>
            <header className=" text-primary fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between pl-5 md:pl-10 pr-10 pt-7 pb-7 space-x-3 h-10">
                <div className="flex justify-center items-center gap-3">
                    {session && <SheetMenu />}
                    <Link className="text-2xl md:text-3xl font-bold rounded-md border-foreground" href={'/'}>SplitEase</Link>
                </div>
                <div className='flex space-x-5 justify-center items-center'>
                    <ModeToggle />
                    {
                        session
                            ?
                            <>
                                <AvatarDrop />
                            </>
                            :
                            <>
                                <Link className="hover:border-b-2 rounded-md border-foreground" href={'/login'}>Login</Link>
                                <Link className="hover:border-b-2 rounded-md border-foreground" href={'/register'}>Register</Link>
                            </>
                    }
                </div>
            </header>
        </>

    )
}

export default Navbar

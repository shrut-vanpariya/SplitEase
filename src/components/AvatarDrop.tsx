"use client";

import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { signOut } from "next-auth/react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useSession } from 'next-auth/react';
import Link from 'next/link';


export function AvatarDrop() {

    const { data: session, status } = useSession();
    // console.log(session);

    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* <Button variant="outline">Open</Button> */}
                <Avatar>
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback>{session?.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={'/profile'}>
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    <Link href={'/dashboard'}>
                        <DropdownMenuItem>
                            Dashboard
                        </DropdownMenuItem>
                    </Link>
                    {/* <DropdownMenuItem>
                        {session?.user?.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {session?.user?.email}
                    </DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut()}
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

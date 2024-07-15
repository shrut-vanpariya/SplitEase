"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useStore } from "@/lib/globalStore";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { data: session, status } = useSession();

    const { userData }: any = useStore();
    // console.log(userData);

    return (<main className='flex flex-col bg-background justify-center items-center min-h-screen w-full'>

        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6 border-border border-[1px] rounded">
                <Image
                    src={session?.user?.image || "/dummy-avatar.png"}
                    alt="image" quality={100}
                    priority={true}
                    height={100}
                    width={100}
                />
                <div>
                    Name: <span className="font-bold">{session?.user?.name}</span>
                </div>
                <div>
                    Email: <span className="font-bold">{session?.user?.email}</span>
                </div>
                <Button
                    onClick={() => signOut()}
                >
                    Log Out
                </Button>
            </div>
        </div>
    </main>
    );
}



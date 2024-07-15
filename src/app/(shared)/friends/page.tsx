"use client"

import { useStore } from "@/lib/globalStore";

import CreateFriend from "@/components/CreateFriend"
import FriendCard from "@/components/FriendCard";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";

export default function Friends() {
    const {userData, friendData }: any = useStore();


    return <>
        <div className="flex flex-col justify-start items-center pt-5 px-5 md:px-10 min-h-[calc(100vh_-_56px)]">
            <div className="flex justify-between md:pl-10 items-center w-full">
                <span className="text-3xl">Friends</span>
                <CreateFriend />
            </div>
            <Separator className="my-5" />
            <ScrollArea className="h-[calc(100vh_-_200px)] w-full rounded-md border">
                <div className="flex flex-wrap gap-5 p-5">
                    {friendData?.map((friend: any, index: any) => {
                        const f = userData?.friends?.find((f: any) => (f.friendId === friend._id))                        
                        return (
                            friend.status === "accepted" ? (
                                <Link key={index} href={`/friends/${friend._id}`}>
                                    <FriendCard user={friend} />
                                </Link>
                            ) : (
                                <Link key={index} href={f.friendRequestSendBy !== userData._id ? `/friends/${friend._id}/status` : "/friends"}>
                                    <FriendCard user={friend} />
                                </Link>
                            )
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    </>
}
"use client"

import { useStore } from "@/lib/globalStore";

import CreateGroup from "@/components/CreateGroup";
import GroupCard from "@/components/GroupCard";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";


export default function Groups() {

    const { groupData }: any = useStore();


    return <>
        <div className="flex flex-col justify-start items-center pt-5 px-5 md:px-10 min-h-[calc(100vh_-_56px)]">
            <div className="flex justify-between md:pl-10 items-center w-full">
                <span className="text-3xl">Groups</span>
                <CreateGroup />
            </div>
            <Separator className="my-5" />
            <ScrollArea className="h-[calc(100vh_-_200px)] w-full rounded-md border">
                <div className="flex flex-wrap gap-5 p-5">
                    {groupData?.map((group: any, index: any) => {
                        return (
                            <Link key={index} href={`/groups/${group._id}`}>
                                <GroupCard group={group} />
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    </>
}
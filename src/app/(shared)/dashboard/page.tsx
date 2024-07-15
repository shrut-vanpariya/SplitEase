"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/globalStore";
import FriendCard from "@/components/FriendCard";
import GroupCard from "@/components/GroupCard";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const currencySymbols = {
    "INR": "₹",
    "USD": "$"
}

interface Expense {
    amount: number;
    createdAt: string;
    createdBy: string;
    currency: keyof typeof currencySymbols;
    description: string;
    groupId: string;
    participants: any[];
    settled: boolean;
    splitMode: string;
    type: string;
    updatedAt: string;
    __v: number;
    _id: string;
}

export default function Home() {
    const { userData, friendData, groupData }: any = useStore();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [currencySymbol, setCurrencySynbol] = useState('₹');

    useEffect(() => {
        if (!userData) return
        try {
            fetch(`/api/expense?uid=${userData?._id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        return;
                    }

                    console.log(data);
                    setExpenses(data.expenses)
                })
                .catch(error => {
                    console.error('Error fetching group expense data:', error);
                });
        } catch (error: any) {
            console.error('Error fetching group expense data:', error);
        }
    }, [userData])

    useEffect(() => {
        if (!userData) return
        if (expenses) {
            let tot = 0
            expenses.map((expense: Expense) => {
                const f = expense.participants.find((p) => (p.userId === userData?._id))

                if (expense.createdBy === userData?._id) {
                    tot += expense.amount - (f ? f.amountOwed : 0)
                }
                else {
                    tot -= f ? f.amountOwed : 0
                }
            })
            setTotalExpense(tot);
        }

    }, [expenses, userData])

    return (
        <>
            <div className="flex flex-col justify-start items-center pt-5 px-5 md:px-10 h-[calc(100vh_-_56px)]">
                <div className="flex justify-between md:pl-10 items-center w-full">
                    <span className="text-3xl">Dashboard</span>
                    <span className="px-5 text-sm md:text-xl">{
                        totalExpense >= 0 ?
                            `You own ${currencySymbol}${totalExpense.toFixed(2)}` :
                            `You owe ${currencySymbol}${(-1 * totalExpense).toFixed(2)}`
                    }</span>
                </div>
                <Separator className="my-5" />
                <ScrollArea className="h-[calc(100vh_-_180px)] w-full rounded-md border">
                    <div className="flex flex-wrap gap-5 p-5">
                        {friendData?.map((friend: any, index: any) => {
                            return (
                                friend.status === "accepted" && (
                                    <Link key={index} href={`/friends/${friend._id}`}>
                                        <FriendCard user={friend} />
                                    </Link>
                                )
                            );
                        })}
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
    );
}



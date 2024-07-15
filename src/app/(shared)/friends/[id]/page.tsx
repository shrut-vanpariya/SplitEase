"use client"

import { useEffect, useState } from "react";
import Link from "next/link"
import { useStore } from "@/lib/globalStore";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area";
import ExpenseCard from "@/components/ExpenseCard";

const currencySymbols = {
    "INR": "₹",
    "USD": "$"
}

interface Friend {
    _id: string;
    username: string;
    email: string;
    image: string;
    status: string;
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


export default function Page({ params }: { params: { id: string } }) {

    const { userData, friendData }: any = useStore();
    const [friend, setFriend] = useState<Friend>();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [currencySymbol, setCurrencySynbol] = useState('₹');

    useEffect(() => {
        if (friendData) {
            const f = friendData.find((friend: any) => friend._id === params.id)
            setFriend(f);
        }
    }, [friendData, params.id])

    useEffect(() => {
        if (!userData?._id || !params.id) return
        try {
            fetch(`/api/expense?uid=${params.id}&fid=${userData?._id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        return;
                    }
                    data.expenses.sort((a: Expense, b: Expense) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })
                    setExpenses(data.expenses)
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        } catch (error: any) {
            console.log(error.message);
        }
    }, [params.id, userData?._id])

    useEffect(() => {
        if (expenses) {
            let tot = 0
            expenses.map((expense: Expense) => {
                if (expense.createdBy === userData?._id) {
                    const f = expense.participants.find((p) => (p.userId._id === params.id))
                    tot += f.amountOwed
                }
                else {
                    const u = expense.participants.find((p) => (p.userId._id === userData?._id))
                    tot -= u ? u.amountOwed : 0
                }
            })
            setTotalExpense(tot);
        }

    }, [expenses, params.id, userData?._id])

    return (
        <div className="flex flex-col justify-start items-center pt-5 px-5 md:px-10 min-h-[calc(100vh_-_56px)]">
            <div className="flex justify-between md:pl-10 items-center w-full">
                <div className="flex justify-center items-center gap-5">
                    <Avatar className="border">
                        <AvatarImage src={friend?.image || "/dummy-avatar.png"} />
                        <AvatarFallback>{friend?.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-2xl md:3xl">{friend?.username.split(" ")[0]}</span>
                </div>
                <Link href={{
                    pathname: "../expenses/create",
                    query: { fid: `${params.id}` }
                }}>
                    <Button className="text-xs md:text-sm">Create Expense</Button>
                </Link>
            </div>
            <Separator className="my-5" />
            <Tabs defaultValue="expenses" className="w-full">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    <span className="px-5 md:text-xl">{totalExpense >= 0 ? `You own ${currencySymbol}${totalExpense.toFixed(2)}` : `You owe ${currencySymbol}${(-1 * totalExpense).toFixed(2)}`}</span>
                </div>
                <TabsContent value="expenses" >
                    <ScrollArea className="h-[calc(100vh_-_230px)] w-full rounded-md border">
                        <div className="flex flex-col justify-center items-center gap-5 p-5">
                            {expenses?.map((expense: any, index: any) => {
                                // return <div key={index}>{expense.description}  ======  {expense.amount}</div>
                                return <ExpenseCard key={index} {...{ expense }} />
                            })}
                        </div>
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="details" >
                    <ScrollArea className="h-[calc(100vh_-_230px)] w-full rounded-md border">
                    <div className="flex flex-col justify-center items-center gap-5 p-5">
                        Friend Details
                    </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    )
}
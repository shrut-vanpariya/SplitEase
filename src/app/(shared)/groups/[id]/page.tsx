"use client"

import { useStore } from "@/lib/globalStore";
import Link from "next/link"
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpenseCard from "@/components/ExpenseCard";


interface Group {
    _id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    members: any[];
    expenses: any[]; // Adjust the type based on the structure of expenses
    __v: number;
}

interface Expense {
    amount: number;
    createdAt: string;
    createdBy: string;
    currency: string;
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

    const [group, setGroup] = useState<Group>();
    const { userData, groupData }: any = useStore();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [currencySymbol, setCurrencySynbol] = useState('₹');

    useEffect(() => {
        if (groupData) {
            const g = groupData.find((group: any) => group._id === params.id)
            setGroup(g);
        }
    }, [groupData, params.id])

    useEffect(() => {
        try {
            fetch(`/api/expense?gid=${params.id}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(data.expenses);
                    setExpenses(data.expenses)
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        } catch (error: any) {
            console.log(error.message);
        }
    }, [params.id])

    useEffect(() => {
        if (expenses) {
            let tot = 0
            expenses.map((expense: Expense) => {
                const f = expense.participants.find((p) => (p.userId._id === userData?._id))
                if (expense.createdBy === userData?._id) {
                    tot += expense.amount - f.amountOwed
                }
                else {
                    tot -= f ? f.amountOwed : 0
                }
            })
            setTotalExpense(tot);
        }

    }, [expenses, params.id, userData?._id])

    return (
        <div className="flex flex-col justify-start items-center pt-5 px-5 md:px-10 min-h-[calc(100vh_-_56px)]">
            <div className="flex justify-between md:pl-10 items-center w-full">
                <div className="flex justify-center items-center gap-2">
                    <Avatar className="border">
                        <AvatarImage src={""} />
                        <AvatarFallback>{group?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-2xl md:text-3xl">{group?.name}</span>
                </div>
                <Link href={{
                    pathname: "../expenses/create",
                    query: { gid: `${params.id}` }
                }}>
                    <Button className="text-xs md:text-sm">Create Expense</Button>
                </Link>
            </div>
            <Separator className="my-5" />
            <Tabs defaultValue="expenses" className="w-full">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    <span className="px-5 text-sm md:text-xl">{totalExpense >= 0 ? `You own ${currencySymbol}${totalExpense.toFixed(2)}` : `You owe ${currencySymbol}${(-1 * totalExpense).toFixed(2)}`}</span>
                </div>
                <TabsContent value="expenses" >
                    <ScrollArea className="h-[calc(100vh_-_230px)] w-full rounded-md border">
                        <div className="flex flex-wrap justify-around gap-5 p-5">
                            {expenses?.map((expense: any, index: any) => {
                                // return <div key={index}>{expense.description}  ======  {expense.amount}</div>
                                return <ExpenseCard key={index} {...{ expense }} />
                            })}
                        </div>
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="members" >
                    <ScrollArea className="h-[calc(100vh_-_230px)] w-full rounded-md border">
                        <div className="flex flex-col gap-5 p-5">
                            {group?.members?.map((member: any, index: any) => {
                                return <div key={index}>{member.userId.username}</div>
                            })}
                        </div>
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="details">
                    <ScrollArea className="h-[calc(100vh_-_230px)] w-full rounded-md border">
                    <div className="flex flex-col justify-center items-center gap-5 p-5">
                        Group Details
                    </div>
                    </ScrollArea>

                </TabsContent>
            </Tabs>
        </div>
    )
}
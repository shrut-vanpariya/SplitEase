import { useEffect, useState } from "react";
import { useStore } from "@/lib/globalStore";

import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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

export default function Component(props: any) {
    const { userData }: any = useStore();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [currencySymbol, setCurrencySynbol] = useState('₹');

    useEffect(() => {
        try {
            fetch(`/api/expense?gid=${props.group._id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        return;
                    }

                    // console.log(data);
                    setExpenses(data.expenses)
                })
                .catch(error => {
                    console.error('Error fetching group expense data:', error);
                });
        } catch (error: any) {
            console.error('Error fetching group expense data:', error);
        }
    }, [props.group._id])

    useEffect(() => {
        if (expenses) {
            let tot = 0
            expenses.map((expense: Expense) => {
                if (!expense.settled) {
                    const f = expense.participants.find((p) => (p.userId._id === userData?._id))
                    if (expense.createdBy === userData?._id) {
                        tot += expense.amount - f.amountOwed
                    }
                    else {
                        tot -= f ? f.amountOwed : 0
                    }
                }
            })
            setTotalExpense(tot);
        }

    }, [expenses, userData?._id])

    return (
        <Card className="w-80 max-w-sm p-6 grid gap-6">
            <div className="flex items-center gap-4">
                <div className="w-1/3 border-r">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={""} />
                        <AvatarFallback className="text-2xl">{props?.group?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col justify-center items-start w-2/3 gap-2">
                    <div className="text-xl font-semibold">{props?.group?.name}</div>
                    <div className="text-sm text-muted-foreground">{totalExpense >= 0 ? `You own ${currencySymbol}${totalExpense.toFixed(2)}` : `You owe ${currencySymbol}${(-1 * totalExpense).toFixed(2)}`}</div>
                </div>
            </div>
        </Card>
    )
}
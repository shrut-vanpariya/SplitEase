import { useEffect, useState } from "react"
import { useStore } from "@/lib/globalStore";

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Banknote, CalendarIcon, CreditCard, Ellipsis, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const currencySymbols = {
    "INR": "₹",
    "USD": "$"
}

interface Expense {
    amount: number;
    createdAt: string;
    createdBy: string;
    currency: keyof typeof currencySymbols,
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

export default function ExpenseCard({ expense }: { expense: Expense }) {

    const { userData }: any = useStore();
    const [userPaid, setUserPaid] = useState<any>();

    useEffect(() => {
        try {
            fetch(`/api/user?uid=${expense.createdBy}`)
                .then(response => response.json())
                .then(data => {
                    setUserPaid(data.user);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        } catch (error: any) {
            console.log(error.message);
        }
    }, [expense.createdBy])

    return (
        <Card className="w-full max-w-md md:flex md:max-w-none relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                
                <Ellipsis   className="h-5 w-5" />
                <span className="sr-only">Settings</span>
            </Button>
            <div className="md:w-1/3 md:border-r">
                <CardHeader className="flex p-4 md:flex-col md:items-start md:p-6">
                    <div className="flex flex-col  gap-3 items-start justify-center">
                        <div className="flex items-center gap-2">
                            <div className="text-4xl font-bold">{currencySymbols[expense.currency]}{expense.amount.toFixed(2)}</div>
                            <div className="text-muted-foreground">{expense.currency}</div>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant={expense.settled ? "default" : "destructive"} className="uppercase font-semibold text-xs">
                                {expense.settled ? "Settled" : "Unsettled"}
                            </Badge>
                            <Badge variant="outline" className="uppercase font-semibold text-xs">
                                {expense.splitMode}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            <div>Created, {new Date(expense.createdAt).toDateString()}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CreditCard className="w-4 h-4" />
                            <div>Paid by {userPaid?.username.split(" ")[0]}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Banknote className="w-4 h-4" />
                            <div>{
                                (userData?._id === userPaid?._id) ?
                                    "You own " + currencySymbols[expense.currency] + (expense.amount - expense.participants.find((p) => p.userId._id === userPaid?._id)?.amountOwed).toFixed(2) :
                                    "You owe " + currencySymbols[expense.currency] + (expense.participants.find((p) => p.userId._id === userPaid?._id)?.amountOwed)?.toFixed(2)}</div>
                        </div>
                    </div>
                </CardHeader>
            </div>
            <div className="md:w-2/3">
                <CardContent className="h-full md:p-6">
                    <div className="text-sm font-medium">Description</div>
                    <div className="text-muted-foreground">{expense.description}</div>
                    <Separator className="my-3" />
                    <div className="grid gap-2">
                        <div className="text-sm font-medium">Participants</div>
                        <ScrollArea className="pb-3">
                            <div className="flex items-center gap-2">
                                {expense.participants.map((p: any, index: any) => {
                                    return (
                                        <Badge key={index} variant="outline" className="gap-3 py-2">
                                            <Avatar className="w-8 h-8 border">
                                                <AvatarImage src={p.userId.image || "/dummy-avatar.png"} />
                                                <AvatarFallback>{p.userId.username[0]}</AvatarFallback>
                                            </Avatar>
                                            {p.userId.username.split(" ")[0]}
                                        </Badge>
                                    )
                                })}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}


// return (
//     <Card className="w-full flex flex-col md:flex-row relative">
//         <CardHeader>
//             <Settings2 className="absolute right-6" />
//             <div className="flex flex-col w-max gap-3 items-start justify-center">
//                 <div className="flex items-center gap-2">
//                     <div className="text-4xl font-bold">{currencySymbols[expense.currency]}{expense.amount}</div>
//                     <div className="text-muted-foreground">{expense.currency}</div>
//                 </div>
//                 <div className="flex gap-2">
//                     <Badge variant={expense.settled ? "default" : "destructive"} className="uppercase font-semibold text-xs">
//                         {expense.settled ? "Settled" : "Unsettled"}
//                     </Badge>
//                     <Badge variant="outline" className="uppercase font-semibold text-xs">
//                         {expense.splitMode}
//                     </Badge>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <CalendarIcon className="w-4 h-4" />
//                     <div>Created, {new Date(expense.createdAt).toDateString()}</div>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <CreditCard className="w-4 h-4" />
//                     <div>Paid by {userPaid?.username.split(" ")[0]}</div>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Banknote className="w-4 h-4" />
//                     <div>{
//                         (userData?._id === userPaid?._id) ?
//                             "You own " + currencySymbols[expense.currency] + expense.participants.find((p) => p.userId !== userPaid?._id)?.amountOwed :
//                             "You owe " + currencySymbols[expense.currency] + expense.participants.find((p) => p.userId === userPaid?._id)?.amountOwed}</div>
//                 </div>
//             </div>
//         </CardHeader>
//         <CardContent className="w-full grid gap-4">
// <div className="md:pt-8">
//     <div className="text-sm font-medium">Description</div>
//     <div className="text-muted-foreground">{expense.description}</div>
// </div>
// <Separator />
// <div className="grid gap-2">
//     <div className="text-muted-foreground">Participants</div>
//     <div className="flex items-center gap-2">
//         <Avatar className="w-8 h-8 border">
//             <AvatarImage src="/dummy-avatar.png" />
//             <AvatarFallback>JD</AvatarFallback>
//         </Avatar>
//         <Avatar className="w-8 h-8 border">
//             <AvatarImage src="/dummy-avatar.png" />
//             <AvatarFallback>SK</AvatarFallback>
//         </Avatar>
//         <Avatar className="w-8 h-8 border">
//             <AvatarImage src="/dummy-avatar.png" />
//             <AvatarFallback>LM</AvatarFallback>
//         </Avatar>
//     </div>
// </div>
//         </CardContent>
//     </Card>
// )
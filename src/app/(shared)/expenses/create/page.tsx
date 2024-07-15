'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from "@/lib/globalStore";
import { useSession } from 'next-auth/react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import ComboBox from '@/components/ComboBox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Member {
    label: String,
    value: String
}

export default function Expenses() {

    const searchParams = useSearchParams()
    const userId = searchParams.get('fid');
    const groupId = searchParams.get('gid');

    const router = useRouter();

    useEffect(() => {
        if (!groupId && !userId) {
            router.push('/dashboard');
        }
    }, [groupId, userId, router]);

    const { toast } = useToast();

    const { userData, friendData, groupData }: any = useStore();

    const [expense, setExpense] = useState({
        description: "",
        amount: 0,
        currency: "INR",
        createdBy: "",
        participants: [],
        type: "",
        groupId: "",
        splitMode: "EVENLY"
    });

    const [memberList, setMemberList] = useState<Member[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [value, setValue] = useState("")


    const handleSubmit = async () => {

        if (!expense.amount || !expense.description || expense.participants.length <= 1) {
            toast({
                variant: "destructive",
                description: `Failed to create Expense..😥, Please enter proper details!`,
            })
            return;
        }
        try {
            const res = await fetch(`/api/expense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expense)
            });
            const data = await res.json();
            // console.log(data);

            if (data?.error) {
                console.log("error page redirect");
                toast({
                    variant: "destructive",
                    description: `Failed to create Expense...😥, ${data?.error}`,
                })
            }
            else {
                toast({
                    description: `Expense created successfully...😊`,
                })
                router.back()
                // router.push('/expenses');
                // router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAdd = () => {

        const friendToAdd = memberList.find((friend: any) => friend.value === value);
        if (friendToAdd) {
            setMemberList(memberList.filter(friend => friend !== friendToAdd));
            setMembers([...members, friendToAdd]);
            setValue('');
        }
    };

    const handleDel = (val: any) => {
        const friendToDel = members.find((member: any) => member.value === val);
        if (friendToDel) {
            setMembers(members.filter((member: any) => member !== friendToDel))
            setMemberList([...memberList, friendToDel])
        }
    }

    useEffect(() => {
        if (userId && userData && friendData) {

            const f = friendData.find((friend: any) => friend._id == userId)
            const membs = [
                {
                    value: userData._id,
                    label: userData.username
                },
                {
                    value: f._id,
                    label: f.username
                }
            ]
            setMembers(membs)
        }
        if (groupId && groupData) {
            const group = groupData.find((group: any) => group._id === groupId)
            var membs = group?.members?.map((member: any) => {
                const { _id, username, email, image } = member?.userId;
                // console.log(email);

                return {
                    value: _id,
                    label: username,
                }
            })
            const currUser = membs.find((user: any) => user.value === userData._id)
            if (!currUser) {
                membs = [...membs, { value: userData._id, label: userData.username }]
            }
            // console.log(userData);
            setMembers(membs);
            // setExpense((expense: any) => ({ ...expense, type: "group", createdBy: userData._id, groupId: groupId }))
        }
    }, [friendData, groupData, groupId, userData, userData?._id, userData?.username, userId])

    useEffect(() => {
        const partc = members.map((member: any) => {
            return { userId: member.value }
        })
        setExpense((expense: any) => ({
            ...expense,
            type: (groupId ? "group" : "individual"),
            createdBy: userData?._id,
            groupId: (groupId ? groupId : null),
            participants: partc
        }))
    }, [groupId, members, userData?._id])

    return <>
        <div className="flex flex-col p-5 justify-center items-center  min-h-[calc(100vh_-_56px)]">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>New Expense</CardTitle>
                    <CardDescription>Enter your expense details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Enter description"
                                value={expense.description}
                                onChange={(e) => setExpense((expense: any) => ({ ...expense, description: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={expense.amount}
                                onChange={(e) => setExpense((expense: any) => ({ ...expense, amount: parseInt(e.target.value) }))}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <Select
                                value={expense.currency}
                                onValueChange={(value) => setExpense((expense: any) => ({ ...expense, currency: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">₹</SelectItem>
                                    {/* <SelectItem value="USD">$</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Split Mode</Label>
                            <Select
                                value={expense.splitMode}
                                onValueChange={(value) => setExpense((expense: any) => ({ ...expense, splitMode: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select split mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EVENLY">Equal</SelectItem>
                                    {/* <SelectItem value="percentage">Percentage</SelectItem> */}
                                    {/* <SelectItem value="custom">Custom</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label>Participants</Label>
                        <div className="flex gap-5">
                            <ComboBox {...{ value, setValue, members: memberList }} />
                            <Button
                                variant={"outline"}
                                onClick={handleAdd}
                            >
                                Add
                            </Button>
                        </div>
                        <ScrollArea>
                            <ul>
                                {
                                    groupId ?
                                        (members.length > 0 && members.map((member: any, index: any) => {
                                            return <li key={index} className="flex justify-between p-2">
                                                <div>
                                                    {member.label}
                                                </div>
                                                {member.value !== userData._id && <Button variant={"outline"} onClick={() => handleDel(member.value)}>
                                                    <Trash2 size={20} />
                                                </Button>}
                                            </li>
                                        }))
                                        : (members.length > 0 && members.map((member: any, index: any) => {
                                            return <li key={index} className="flex justify-between p-2">
                                                <div>
                                                    {member.label}
                                                </div>
                                            </li>
                                        }))
                                }
                            </ul>
                        </ScrollArea>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSubmit}>Save Expense</Button>
                </CardFooter>
            </Card>
        </div>
    </>
}

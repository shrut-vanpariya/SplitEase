'use client';

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from 'lucide-react';

import { useStore } from "@/lib/globalStore";

import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import ComboBox from "@/components/ComboBox";



const CircularLoading = () => {
    return (
        <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )
}



export default function CreateGroup() {

    const { toast } = useToast();

    const router = useRouter()
    const { userData, friendData }: any = useStore();

    const [value, setValue] = useState("")

    const [groupName, setGroupName] = useState("")
    const [friendList, setFriendList] = useState([])
    const [members, setMembers] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleAdd = () => {

        const friendToAdd = friendList.find((friend: any) => friend.value === value);
        if (friendToAdd) {
            setFriendList(friendList.filter(friend => friend !== friendToAdd));
            setMembers([...members, friendToAdd]);
            setValue('');
        }
    };

    const handleDel = (val: any) => {
        const friendToDel = members.find((member: any) => member.value === val);
        if (friendToDel) {
            setMembers(members.filter((member: any) => member !== friendToDel))
            setFriendList([...friendList, friendToDel])
        }
    }


    const handleSubmit = async () => {

        const membersId = members.map((member: any) => {
            return member.value
        })

        if(!groupName || members.length <= 0) {
            toast({
                variant: "destructive",
                description: `Failed to create Group..😥, Please enter proper details!`,
            })
            return
        }

        setIsLoading(true);
        setOpenDialog(false);
        // await new Promise(r => setTimeout(r, 10000));
        try {
            const res = await fetch(`/api/group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: groupName,
                    createdBy: userData._id,
                    members: membersId
                })
            });
            const data = await res.json();
            console.log(data);

            if (data?.error) {
                console.log("error page redirect");
                toast({
                    variant: "destructive",
                    description: `Failed to create Group...😥, ${data?.error}`,
                })
            }
            else {
                toast({
                    description: `Group created successfully...😊`,
                })
                // router.push('/');
                // router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);

    }

    useEffect(() => {

        if (friendData) {
            const friends = friendData.map((friend: any) => {
                const { _id, username, email, image } = friend;
                return {
                    value: _id,
                    label: username,
                }
            })
            setFriendList(friends);
        }
    }, [friendData])

    return (
        <>
            {
                isLoading
                    ?
                    <>
                        <CircularLoading />
                    </>
                    :
                    <>
                        <div className="hidden md:block">
                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="default" onClick={() => { setOpenDialog(true) }}>Create Group</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>New Group</DialogTitle>
                                        <DialogDescription>
                                            Fill out the form to create a new group.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="p-4 pb-0 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="groupName">Group Name</Label>
                                            <Input
                                                id="groupName"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                placeholder="Enter group name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col">
                                            <Label>Members</Label>
                                            <div className="flex gap-5">
                                                <ComboBox {...{ value, setValue, members:friendList }} />
                                                <Button
                                                    variant={"outline"}
                                                    onClick={handleAdd}
                                                    className="w-full"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                        <ScrollArea>
                                            <ul className="max-h-96">
                                                {members.length > 0 && members.map((member: any, index: any) => {
                                                    return <li key={index} className="flex justify-between p-2">
                                                        <div>
                                                            {member.label}
                                                        </div>
                                                        <Button variant={"outline"} onClick={() => handleDel(member.value)}>
                                                            <Trash2 size={20} />
                                                        </Button>
                                                    </li>
                                                })}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                    <DialogFooter>
                                        <Button className="w-full" onClick={handleSubmit}>Create Group</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="md:hidden">
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <Button>Create  Group</Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>New Group</DrawerTitle>
                                        <DrawerDescription>Fill out the form to create a new group.</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="p-4 pb-0 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="groupName">Group Name</Label>
                                            <Input
                                                id="groupName"
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                placeholder="Enter group name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col">
                                            <Label >Members</Label>
                                            <div className="flex gap-5">
                                                <ComboBox {...{ value, setValue, members:friendList }} />
                                                <Button
                                                    variant={"outline"}
                                                    onClick={handleAdd}
                                                    className="w-full"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                        <ScrollArea>
                                            <ul className="h-96">
                                                {members.length > 0 && members.map((member: any, index: any) => {
                                                    return <li key={index} className="flex justify-between p-3">
                                                        <div>
                                                            {index + 1}. {member.label}
                                                        </div>
                                                        <Button variant={"outline"} onClick={() => handleDel(member.value)}>
                                                            <Trash2 size={20} />
                                                        </Button>
                                                    </li>
                                                })}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                    <DrawerFooter>
                                        <Button onClick={handleSubmit}>Create Group</Button>
                                        <DrawerClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </>
            }
        </>
    )
}

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "./ui/use-toast";

import { useStore } from "@/lib/globalStore";

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

export default function CreateFriend() {

    const { toast } = useToast();

    const router = useRouter()

    const { userData, setReloadData }: any = useStore();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);


    const handleSubmit = async () => {
        setIsLoading(true);
        setOpenDialog(false);
        try {
            const res = await fetch(`/api/friend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userEmail: userData.email,
                    friendEmail: email
                })
            });
            const data = await res.json();
            console.log(data);

            if (data?.error) {
                console.log("error page redirect");
                toast({
                    variant: "destructive",
                    description: `Failed to make friend..😥, ${data?.error}`,
                })
            }
            else {
                toast({
                    description: `Friend request is sent to ${email} ...😊`,
                })
                setReloadData(true)
                // router.push('/');
                // router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }


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
                                    <Button onClick={() => { setOpenDialog(true) }}>Make Friend</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>New Friend</DialogTitle>
                                        <DialogDescription>
                                            Enter email id of friend to make new friend.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                value={email}
                                                placeholder="abc@gmail.com"
                                                className="col-span-3"
                                                onChange={(e: any) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSubmit}>Make friend</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="md:hidden">
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <Button>Make Friend</Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>New Friend</DrawerTitle>
                                        <DrawerDescription>Enter email id of friend to make new friend.</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="grid gap-4 p-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                value={email}
                                                placeholder="abc@gmail.com"
                                                className="col-span-3"
                                                onChange={(e: any) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DrawerFooter>
                                        <Button onClick={handleSubmit}>Send Request</Button>
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

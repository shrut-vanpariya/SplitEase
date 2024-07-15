"use client"

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/lib/globalStore";
import { useRouter } from "next/navigation";


export default function Page({ params }: { params: { id: string } }) {

    const { toast } = useToast();
    const router = useRouter();
    const { userData, setReloadData }: any = useStore();


    const handleSubmit = async (status: String) => {
        if (!userData) {
            toast({
                variant: "destructive",
                description: `User does not exist..😥, Please try again!`,
            })
            return;
        }
        try {
            const res = await fetch(`/api/friend`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userData._id, 
                    friendId: params.id, 
                    status: status
                })
            });
            const data = await res.json();
            // console.log(data);

            if (data?.error) {
                console.log("error page redirect");
                toast({
                    variant: "destructive",
                    description: `Failed to ${status}...😥, ${data?.error}`,
                })
            }
            else {
                toast({
                    description: `Friend ${status}...😊`,
                })
                setReloadData(true)
                // if(status === "accepted")
                //     router.push(`/friends/${params.id}`);
                // else 
                    router.push(`/friends`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex gap-2 justify-center items-center pt-5 px-5 md:px-10 min-h-[calc(100vh_-_56px)]">
            Please Accept or Reject the friend request :
            <Button onClick={() => handleSubmit("accepted")}>Accept</Button>
            <Button variant={'outline'} onClick={() => handleSubmit("rejected")}>Reject</Button>
        </div>
    )
}
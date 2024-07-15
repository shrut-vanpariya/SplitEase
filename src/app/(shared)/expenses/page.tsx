"use client";

import CreateGroup from "@/components/CreateGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Expenses() {
    const [state, setState] = useState("some state");
    const router = useRouter();

    return <>
        <div className="flex flex-col justify-center items-center  min-h-[calc(100vh_-_56px)]">
            <Link href={{
                pathname: "/dashboard",
            }}>
                <Button>Create Expense</Button>
            </Link>
        </div>
    </>
}
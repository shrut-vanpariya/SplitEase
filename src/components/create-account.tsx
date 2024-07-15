"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "./ui/separator"
import { useToast } from "@/components/ui/use-toast"



export function CreateAccount() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { data: session, status } = useSession()

    const router = useRouter();

    const { toast } = useToast()

    const handleRegisterGoogle = async () => {
        setIsLoading(true)
        const user = await signIn("google")
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }

    const handleRegisterGithub = async () => {
        setIsLoading(true)
        const user = await signIn("github")

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)

    }

    const handleRegister = async () => {
        if (!username || !email || !password) {
            toast({
                variant: 'destructive',
                description: 'No field should be empty!',
            })
            return;
        }

        try {
            setIsLoading(true);
            console.log(username, email, password);

            const res = await fetch("api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (res.status === 400) {
                toast({
                    variant: "destructive",
                    description: data.message,
                })
            }
            else {
                toast({
                    description: data.message,
                })
                router.push('/login')
            }

            setIsLoading(false)
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    }

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/')
        }
    }, [router, status]);

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-6">
                    <Button
                        variant="outline"
                        onClick={handleRegisterGithub}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.gitHub className="mr-2 h-4 w-4" />
                        )}{" "}
                        GitHub
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRegisterGoogle}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.google className="mr-2 h-4 w-4" />
                        )}{" "}
                        Google
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder=""
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-5">
                <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={isLoading}>
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create account
                </Button>
                <Separator />
                <p>Already have an account click <Link className="font-bold underline" href={'/login'}>here</Link> </p>
            </CardFooter>
        </Card>
    )
}
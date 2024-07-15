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


export function LoginAccount() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { data: session, status } = useSession()

    const router = useRouter();

    const { toast } = useToast()

    const handleLoginGoogle = async () => {
        const user = await signIn("google")
    }

    const handleLoginGithub = async () => {
        const user = await signIn("github")
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)

    }

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            console.log(email, password);
            
            const res: any = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            console.log(res);

            if (res.error === null) {
                toast({
                    description: "Login successfully!",
                })
                router.push('/dashboard');
            }
            else {
                toast({
                    variant: "destructive",
                    description: "Invalid Credentials!",
                })
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    };

        useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [router, status]);

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-6">
                    <Button
                        variant="outline"
                        onClick={handleLoginGithub}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.gitHub className="mr-2 h-4 w-4" />
                        )}{" "}
                        Github
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleLoginGoogle}
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
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                </Button>
                <Separator />
                <p>Don&#39;t have an account? click <Link className="font-bold underline" href={'/register'}>here</Link> </p>
            </CardFooter>
        </Card>
    )
}
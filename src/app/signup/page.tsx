
'use client';

import * as React from "react";
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { signup } from "../auth/actions";
import { useSearchParams } from "next/navigation";


function SignupForm() {
    const [showPassword, setShowPassword] = React.useState(false);
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    return (
        <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form>
            <CardContent className="grid gap-4">
            {message && (
                <div className="text-center text-sm text-foreground p-2 bg-muted rounded-md">
                    {message}
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="first-name">Full Name</Label>
                <Input id="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" formAction={signup}>
                Create an account
            </Button>
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                    Sign in
                </Link>
            </div>
            </CardFooter>
        </form>
      </Card>
    );
}


export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
          p-commerce
          </span>
      </div>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}

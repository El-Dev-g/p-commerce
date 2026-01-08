
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
import Link from "next/link";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "../auth/actions";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid gap-4">
             {message && (
                <div className="text-center text-sm text-destructive p-2 bg-destructive/10 rounded-md">
                    {message}
                </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
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
            <Button className="w-full" formAction={login}>Sign in</Button>
             <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
          p-commerce
          </span>
      </div>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

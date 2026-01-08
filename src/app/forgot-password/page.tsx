
'use client';

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
import { Sparkles, Loader2 } from "lucide-react";
import { sendPasswordResetEmail } from "../auth/actions";
import { useSearchParams } from "next/navigation";

function ForgotPasswordForm() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
                Enter your email and we will send you a link to reset your password.
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
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" formAction={sendPasswordResetEmail}>Send Reset Link</Button>
                <div className="text-center text-sm">
                Remembered your password?{' '}
                <Link href="/login" className="underline">
                    Back to Login
                </Link>
                </div>
            </CardFooter>
            </form>
        </Card>
    );
}


export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
          p-commerce
          </span>
      </div>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}

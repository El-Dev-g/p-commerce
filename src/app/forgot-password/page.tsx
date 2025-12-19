
'use client';

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
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSendResetLink = (event: React.FormEvent) => {
    event.preventDefault();
    // Mock logic
    toast({
      title: "Password Reset Link Sent",
      description: "If an account exists, a reset link has been sent to your email.",
    });
    // In a real app, you'd handle sending the email here.
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
          p-commerce
          </span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSendResetLink}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">Send Reset Link</Button>
            <div className="text-center text-sm">
              Remembered your password?{' '}
              <Link href="/login" className="underline">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

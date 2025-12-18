
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { requestRefundAction } from './actions';
import { Loader2 } from 'lucide-react';

export default function RequestRefundPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitRefund = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await requestRefundAction({
        orderId: formData.get('orderId') as string,
        reason: formData.get('reason') as string,
    });

    if (result.success) {
        toast({
            title: 'Refund Request Submitted',
            description: result.message,
        });
        // Reset form if needed, for this simple case we can just let the user navigate away
        (e.target as HTMLFormElement).reset();
    } else {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: result.error,
        });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="mx-auto max-w-md">
        <form onSubmit={handleSubmitRefund}>
            <Card>
            <CardHeader>
                <CardTitle className="text-3xl">Request a Refund</CardTitle>
                <CardDescription>
                We're sorry things didn't work out. Please fill out the form below to start the refund process.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                    id="orderId"
                    name="orderId"
                    placeholder="e.g., ORD001"
                    required
                    disabled={isLoading}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="reason">Reason for Refund</Label>
                <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Please describe why you are requesting a refund..."
                    required
                    className="min-h-[120px]"
                    disabled={isLoading}
                />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </CardFooter>
            </Card>
        </form>
      </div>
    </div>
  );
}

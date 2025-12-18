
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function RequestRefundPage() {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmitRefund = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd call an API to submit this request
    console.log(`Refund request for order ${orderId} with reason: ${reason}`);
    toast({
      title: 'Refund Request Submitted',
      description:
        'Your request has been sent to our support team. We will get back to you shortly.',
    });
    setOrderId('');
    setReason('');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Request a Refund</CardTitle>
            <CardDescription>
              We're sorry things didn't work out. Please fill out the form below to start the refund process.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmitRefund}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="e.g., ORD001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Refund</Label>
                <Textarea
                  id="reason"
                  placeholder="Please describe why you are requesting a refund..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardContent>
              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}

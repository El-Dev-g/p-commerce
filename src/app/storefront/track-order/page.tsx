
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to get order status.
    console.log(`Tracking order ${orderId} for email ${email}`);
    toast({
      title: 'Order Status',
      description: `Fetching status for order #${orderId}... (This is a simulation)`,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Track Your Order</CardTitle>
            <CardDescription>
              Enter your order ID and email to see the status of your shipment.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleTrackOrder}>
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
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardContent>
                <Button type="submit" className="w-full">
                    Track Order
                </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}

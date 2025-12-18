
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { trackOrderAction } from './actions';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type OrderStatusInfo = {
  id: string;
  status: string;
  date: string;
  trackingNumber?: string;
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatusInfo | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOrderStatus(null);

    const result = await trackOrderAction({ orderId, email });

    if (result.success && result.order) {
      setOrderStatus(result.order);
    } else {
      toast({
        variant: 'destructive',
        title: 'Order Not Found',
        description: result.error,
      });
    }

    setIsLoading(false);
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Track Order
                </Button>
            </CardContent>
          </form>
        </Card>

        {orderStatus && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Showing status for order #{orderStatus.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{orderStatus.status}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span className="font-medium">{orderStatus.date}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking Number</span>
                <span className="font-medium">
                  {orderStatus.trackingNumber || 'Not available yet'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

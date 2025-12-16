'use client';

import { useState } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Order } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Search, PackageCheck, PackageSearch } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setOrder(null);
    setIsLoading(true);

    // Simulate a delay for fetching order
    setTimeout(() => {
      // In a real app, you would fetch this from a database.
      // For this prototype, we retrieve it from localStorage.
      const storedOrder = localStorage.getItem('lastOrder');
      if (storedOrder) {
        const parsedOrder: Order = JSON.parse(storedOrder);
        if (parsedOrder.id === orderId.trim()) {
          setOrder(parsedOrder);
        } else {
          setError('Order not found. Please check the ID and try again.');
        }
      } else {
        setError('No order information found in your browser.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Track Your Order
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Enter your order ID below to check its status.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <Input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g., ord_...)"
                className="bg-background"
                required
                aria-label="Order ID"
              />
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? 'Searching...' : <><Search className="mr-2 h-5 w-5" /> Track</>}
              </Button>
            </form>

            {error && <p className="mt-4 text-center text-destructive">{error}</p>}
          </div>

          {isLoading && (
             <div className="mt-12 flex flex-col items-center justify-center text-center">
                <PackageSearch className="h-12 w-12 animate-pulse text-primary" />
                <p className="mt-4 text-muted-foreground">Searching for your order...</p>
             </div>
          )}

          {order && (
            <div className="mx-auto mt-12 max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <PackageCheck className="h-8 w-8 text-green-500" />
                    <span>Order Status: Shipped</span>
                  </CardTitle>
                  <CardDescription>Order ID: {order.id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground mb-6'>Your order has shipped. A confirmation with tracking details has also been sent via WhatsApp.</p>
                    <div className="mb-6 rounded-md border bg-secondary p-4">
                        <p className="text-sm font-semibold text-muted-foreground">Tracking Information</p>
                        <p className="font-mono text-lg tracking-widest">{order.carrier}: {order.trackingNumber}</p>
                    </div>
                    <Separator className="my-6" />
                    <h3 className='font-headline text-xl font-semibold mb-4'>Order Summary</h3>
                     {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                            <Image
                                src={item.product.image.src}
                                alt={item.product.image.alt}
                                fill
                                className="object-cover"
                            />
                            </div>
                            <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        </div>
                    ))}
                    <Separator className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <p>Total</p>
                        <p>${order.total.toFixed(2)}</p>
                    </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    } else {
      // Redirect to home if no order is found
      router.push('/');
    }
  }, [router]);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p>Loading order details...</p>
      </div>
    );
  }

  const { customer, items, total, id, orderDate } = order;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight md:text-5xl">
                    Thank You for Your Order!
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your order has been placed successfully. A confirmation email has been sent to {customer.email}.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Order ID: {id}</p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className='space-y-6'>
                    <h2 className="font-headline text-2xl font-semibold">Shipping to</h2>
                    <address className="not-italic text-muted-foreground">
                        {customer.firstName} {customer.lastName}<br />
                        {customer.address}<br />
                        {customer.city}, {customer.state} {customer.zip}<br />
                        {customer.phone}
                    </address>

                    <h2 className="font-headline text-2xl font-semibold">Order Date</h2>
                    <p className="text-muted-foreground">{new Date(orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex items-center justify-between">
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
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                         <Button size="lg" className="w-full mt-4" asChild>
                            <Link href="/shop">Continue Shopping</Link>
                        </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

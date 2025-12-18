
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const { clearCart } = useCart();

  // Clear the cart when the component mounts
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="text-4xl font-bold tracking-tighter">Thank You for Your Order!</h1>
        <p className="max-w-md text-muted-foreground">
          Your order has been placed successfully. You will receive an email confirmation shortly with your order details.
        </p>
        <Button asChild>
          <Link href="/storefront">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

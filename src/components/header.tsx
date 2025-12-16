"use client";

import Link from 'next/link';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Cart } from '@/components/cart';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

export function Header() {
  const { cartItems } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">Curated Finds</span>
        </Link>
        
        <nav className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 p-0">
                <ShoppingBag className="h-6 w-6" />
                {isClient && itemCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Open cart, {itemCount} items</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
              <Cart />
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}

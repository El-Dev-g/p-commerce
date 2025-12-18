
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from './ui/button';
import { CartSheet } from './cart-sheet';
import { Badge } from './ui/badge';

export function StorefrontHeader() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/storefront" className="flex items-center gap-2">
            <span className="text-xl font-bold">Curated Finds</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/storefront" className="hover:underline">Home</Link>
            <Link href="/storefront/catalog" className="hover:underline">Catalog</Link>
            <Link href="/storefront/pages/about-us" className="hover:underline">About</Link>
            <Link href="/storefront/pages/contact-us" className="hover:underline">Contact</Link>
          </nav>
          <div className="relative">
             <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Open Cart</span>
            </Button>
            {itemCount > 0 && (
                <Badge 
                    variant="default" 
                    className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0"
                >
                    {itemCount}
                </Badge>
            )}
          </div>
        </div>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}

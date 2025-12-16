"use client";

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/cart-item';
import { Recommendations } from '@/components/recommendations';
import { ShoppingBag } from 'lucide-react';
import { SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';

export function Cart() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  return (
    <>
      <SheetHeader className="p-6 pb-4">
        <SheetTitle>Shopping Cart</SheetTitle>
      </SheetHeader>
      <Separator />
      {cartItems.length > 0 ? (
        <div className="flex h-full flex-col">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 p-6">
              {cartItems.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </ScrollArea>
          <div className="border-t">
            <SheetFooter className="flex-col space-y-2 p-6">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="w-full pt-4">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Checkout
                </Button>
              </div>
              <div className="flex justify-center text-center text-sm">
                <Button variant="link" onClick={() => clearCart()}>
                  Or clear cart and continue shopping
                  <span aria-hidden="true" className="ml-1"> &rarr;</span>
                </Button>
              </div>
            </SheetFooter>
          </div>
          <Separator />
          <ScrollArea className="max-h-56">
            <div className="p-6">
              <Recommendations />
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Your cart is empty.</p>
          <p className="text-sm text-muted-foreground">Add items to see them here.</p>
        </div>
      )}
    </>
  );
}

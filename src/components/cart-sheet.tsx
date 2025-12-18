
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { cartItems, total, removeFromCart, updateQuantity, itemCount } = useCart();

  const handleRemove = (productId: string, variationId?: string) => {
    removeFromCart(productId, variationId);
    toast({
        title: 'Item Removed',
        description: 'The item has been removed from your cart.',
        variant: 'destructive'
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.product.id}-${item.variation?.id || index}`} className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Image
                            src={item.product.image.src}
                            alt={item.product.image.alt}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                        />
                        <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            {item.variation && (
                                <div className="text-sm text-muted-foreground">
                                    {item.variation.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground">${(item.product.price + (item.variation?.priceModifier || 0)).toFixed(2)}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variation?.id)}
                                >
                                <Minus className="h-3 w-3" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variation?.id)}
                                >
                                <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => handleRemove(item.product.id, item.variation?.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="px-6 py-4">
              <div className="w-full space-y-4">
                 <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                 <Button className="w-full" asChild onClick={() => onOpenChange(false)}>
                    <Link href="/storefront/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add some products to get started.</p>
             <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/storefront/catalog">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

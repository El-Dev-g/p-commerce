"use client";

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import type { CartItem as CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(item.product.id);
      toast({
        description: `${item.product.name} removed from cart.`,
      });
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-background">
        <Image
          src={item.product.image.src}
          alt={item.product.image.alt}
          fill
          className="object-cover"
          data-ai-hint={item.product.image['data-ai-hint']}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
          </div>
          <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-10 text-center" aria-live="polite" aria-label="Quantity">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              removeFromCart(item.product.id);
              toast({
                description: `${item.product.name} removed from cart.`,
              });
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

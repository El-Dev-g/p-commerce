'use client';

import { useEffect, useState, useTransition } from 'react';
import { getProductRecommendations } from '@/ai/flows/get-product-recommendations';
import { useCart } from '@/context/cart-context';
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Recommendations() {
  const { cartItems, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (cartItems.length > 0) {
      startTransition(async () => {
        try {
          // First, get all available products from the "API"
          const allProducts = await getProducts();
          
          const cartItemIds = cartItems.map(item => item.product.id);
          const result = await getProductRecommendations({ cartItems: cartItemIds, numberOfRecommendations: 2 });
          
          const recommendedProducts = result.productRecommendations
            .map(id => allProducts.find(p => p.id === id))
            .filter((p): p is Product => p !== undefined)
            .filter(p => !cartItemIds.includes(p.id)); // Ensure we don't recommend items already in the cart
            
          setRecommendations(recommendedProducts);
        } catch (error) {
          console.error("Failed to get recommendations:", error);
          toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not fetch AI recommendations.",
          });
        }
      });
    } else {
      setRecommendations([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]); // Rerun when the number of items in cart changes

  if (cartItems.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-headline text-lg font-semibold">You Might Also Like</h3>
      {isPending && (
         <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading recommendations...</span>
         </div>
      )}
      {!isPending && recommendations.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map(product => (
            <Card key={product.id} className="overflow-hidden bg-secondary">
              <CardContent className="flex items-center gap-4 p-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image src={product.image.src} alt={product.image.alt} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                </div>
                <Button size="sm" onClick={() => addToCart(product)}>Add</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!isPending && recommendations.length === 0 && cartItems.length > 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">No recommendations for now. Keep shopping!</p>
      )}
    </div>
  );
}

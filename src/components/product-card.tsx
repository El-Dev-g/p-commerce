"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="group flex h-full transform flex-col overflow-hidden border-0 bg-transparent shadow-none transition-transform duration-300">
      <CardHeader className="p-0">
        <div className="relative h-80 w-full overflow-hidden rounded-lg">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint={product.image['data-ai-hint']}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4 px-1 pt-4">
        <CardTitle className="mb-1 font-body text-lg font-normal tracking-wide">{product.name}</CardTitle>
        <p className="text-base font-bold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-1 pt-2">
        <Button variant="secondary" className="w-full" onClick={() => addToCart(product)}>
          <Plus className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

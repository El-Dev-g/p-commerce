
'use client';

import { products } from '@/lib/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Image
            src={product.image.src}
            alt={product.image.alt}
            width={800}
            height={800}
            className="rounded-lg object-cover w-full aspect-square"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-muted-foreground mb-4">${product.price.toFixed(2)}</p>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">{product.description}</p>
          <Button size="lg" onClick={() => handleAddToCart(product)}>
            Add to Cart
          </Button>
           <div className="mt-6 text-sm text-muted-foreground">
            Category: <span className="font-medium text-foreground">{product.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

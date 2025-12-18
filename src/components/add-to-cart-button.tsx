
'use client';

import { useCart } from '@/context/cart-context';
import { toast } from '@/hooks/use-toast';
import type { Product, ProductVariation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function AddToCartButton({ product, variation }: { product: Product; variation?: ProductVariation }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If the product has variations, don't add to cart from the grid.
    // Instead, navigate to the product page.
    if (product.variations && product.variations.length > 0 && !variation) {
        e.preventDefault();
        router.push(`/storefront/products/${product.id}`);
        return;
    }

    addToCart(product, variation);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  }

  return (
    <Button className="w-full" onClick={handleAddToCart}>
        {product.variations && product.variations.length > 0 && !variation ? 'Select Options' : 'Add to Cart'}
    </Button>
  );
}

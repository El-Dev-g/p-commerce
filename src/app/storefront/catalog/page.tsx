
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { products as allProducts } from '@/lib/products';
import { Loader2 } from 'lucide-react';

const PRODUCTS_PER_PAGE = 8;

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Load initial products
    setProducts(allProducts.slice(0, PRODUCTS_PER_PAGE));
    if (allProducts.length <= PRODUCTS_PER_PAGE) {
        setHasMore(false);
    }
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        const currentLength = products.length;
        const newProducts = allProducts.slice(currentLength, currentLength + PRODUCTS_PER_PAGE);
        const updatedProducts = [...products, ...newProducts];
        setProducts(updatedProducts);
        
        if (updatedProducts.length >= allProducts.length) {
            setHasMore(false);
        }
        setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-8">Our Collection</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
                <Card key={product.id} className="flex flex-col">
                    <CardContent className="p-0">
                         <Link href={`/storefront/products/${product.id}`}>
                            <Image 
                                src={product.image.src} 
                                alt={product.image.alt}
                                width={400}
                                height={300}
                                className="h-auto w-full rounded-t-lg object-cover aspect-[4/3]"
                            />
                        </Link>
                    </CardContent>
                    <CardHeader className="p-4 flex-grow">
                         <Link href={`/storefront/products/${product.id}`}>
                            <CardTitle className="text-lg hover:underline">{product.name}</CardTitle>
                         </Link>
                        <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                    </CardHeader>
                    <div className="p-4 pt-0">
                        <AddToCartButton product={product} />
                    </div>
                </Card>
            ))}
        </div>

        {hasMore && (
            <div className="mt-12 text-center">
                <Button onClick={handleLoadMore} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Loading...' : 'Load More'}
                </Button>
            </div>
        )}
    </div>
  );
}

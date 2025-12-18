
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { products as allProducts, categories } from '@/lib/products';
import { Loader2, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const PRODUCTS_PER_PAGE = 8;

export default function CatalogPage() {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const priceRange = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 100 };
    const prices = allProducts.map(p => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, []);

  const [priceValue, setPriceValue] = useState<number[]>([priceRange.max]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const priceMatch = product.price <= priceValue[0];
      return categoryMatch && priceMatch;
    });
  }, [selectedCategory, priceValue]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, PRODUCTS_PER_PAGE));
    setHasMore(filteredProducts.length > PRODUCTS_PER_PAGE);
  }, [filteredProducts]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const newProducts = filteredProducts.slice(currentLength, currentLength + PRODUCTS_PER_PAGE);
      const updatedProducts = [...displayedProducts, ...newProducts];
      setDisplayedProducts(updatedProducts);

      if (updatedProducts.length >= filteredProducts.length) {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tighter">Our Collection</h1>
        <div className="flex items-center gap-4">
          <div className="w-full md:w-64">
             <Label htmlFor="price-range" className="mb-2 block text-sm font-medium">Max Price: ${priceValue[0]}</Label>
             <Slider
                id="price-range"
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                value={priceValue}
                onValueChange={setPriceValue}
             />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                {categories.map(category => (
                  <DropdownMenuRadioItem key={category} value={category}>
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedProducts.map(product => (
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

      {filteredProducts.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <p>No products match your filters.</p>
         </div>
      )}

      {hasMore && filteredProducts.length > 0 && (
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

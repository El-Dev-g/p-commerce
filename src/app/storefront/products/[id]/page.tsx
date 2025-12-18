
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { toast } from '@/hooks/use-toast';
import type { Product, ProductVariation } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { products as allProducts } from '@/lib/products';

function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const variationAttributes = useMemo(() => {
    if (!product?.variations) return {};
    const attributes: Record<string, Set<string>> = {};
    for (const variation of product.variations) {
      for (const attr of variation.attributes) {
        if (!attributes[attr.name]) {
          attributes[attr.name] = new Set();
        }
        attributes[attr.name].add(attr.value);
      }
    }
    return Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, Array.from(value)]));
  }, [product?.variations]);

  const selectedVariation = useMemo(() => {
    if (!product?.variations || Object.keys(selectedOptions).length < Object.keys(variationAttributes).length) {
      return null;
    }
    return product.variations.find(v => 
      v.attributes.every(attr => selectedOptions[attr.name] === attr.value)
    );
  }, [product?.variations, selectedOptions, variationAttributes]);

  const handleOptionChange = (attributeName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [attributeName]: value }));
  };

  const handleAddToCart = () => {
    if (product.variations && product.variations.length > 0 && !selectedVariation) {
        toast({
            title: 'Please select options',
            description: 'You must select all available options before adding to cart.',
            variant: 'destructive',
        });
        return;
    }
    addToCart(product, selectedVariation || undefined);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const displayPrice = product.price + (selectedVariation?.priceModifier || 0);

  return (
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
        <p className="text-2xl text-muted-foreground mb-4">${displayPrice.toFixed(2)}</p>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">{product.description}</p>
        
        {Object.entries(variationAttributes).map(([name, values]) => (
          <div key={name} className="mb-6">
            <Label className="text-lg font-medium capitalize mb-2 block">{name}</Label>
            <RadioGroup
              value={selectedOptions[name]}
              onValueChange={(value) => handleOptionChange(name, value)}
              className="flex flex-wrap gap-2"
            >
              {values.map(value => (
                 <Label
                  key={value}
                  htmlFor={`${name}-${value}`}
                  className={cn(
                    "cursor-pointer rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground",
                    selectedOptions[name] === value && "border-primary"
                  )}
                 >
                   <RadioGroupItem value={value} id={`${name}-${value}`} className="sr-only" />
                   {value}
                 </Label>
              ))}
            </RadioGroup>
          </div>
        ))}

        <Button size="lg" onClick={handleAddToCart}>
          Add to Cart
        </Button>
         <div className="mt-6 text-sm text-muted-foreground">
          Category: <span className="font-medium text-foreground">{product.category}</span>
        </div>
      </div>
    </div>
  );
}


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProduct() {
      try {
        setIsLoading(true);
        // Simulate network delay for loading state
        await new Promise(resolve => setTimeout(resolve, 200)); 
        const foundProduct = allProducts.find(p => p.id === id) || null;
        setProduct(foundProduct);
      } catch (error) {
        console.error('Failed to fetch product', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }
    getProduct();
  }, [id]);


  if (isLoading) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <Skeleton className="w-full aspect-square rounded-lg" />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-40" />
                </div>
            </div>
        </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find the product you were looking for.</p>
        <Button asChild>
          <Link href="/storefront/catalog">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        <ProductDetails product={product} />
    </div>
  );
}

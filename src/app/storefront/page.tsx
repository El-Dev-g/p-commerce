
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { toast } from '@/hooks/use-toast';

export default function StorefrontPage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  }

  return (
    <>
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <Image
              src="https://picsum.photos/seed/storefront-hero/1200/800"
              alt="Hero Image"
              width={1200}
              height={800}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              data-ai-hint="elegant storefront display"
            />
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Discover Our Curated Collection</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Explore a world of hand-picked items that blend quality craftsmanship with timeless design.
              </p>
              <Link href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-fit">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <div className="space-y-3">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Products</h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                      Check out some of our favorite and most popular items.
                  </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.slice(0, 4).map(product => (
                      <Card key={product.id}>
                          <CardContent className="p-0">
                              <Image 
                                  src={product.image.src} 
                                  alt={product.image.alt}
                                  width={400}
                                  height={300}
                                  className="h-auto w-full rounded-t-lg object-cover aspect-[4/3]"
                              />
                          </CardContent>
                          <CardHeader className="p-4 flex-grow">
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                          </CardHeader>
                          <div className="p-4 pt-0">
                             <Button className="w-full" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                          </div>
                      </Card>
                  ))}
              </div>
          </div>
      </section>
    </>
  );
}

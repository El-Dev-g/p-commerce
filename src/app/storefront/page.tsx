
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { products as allProducts } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Helper function to render a section based on its type
const renderSection = (section: { type: string; id: string }, products: Product[], heroImage: any) => {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} heroImage={heroImage} />;
    case 'featured-collection':
      return <FeaturedProductsSection key={section.id} products={products} />;
    case 'newsletter':
        return <NewsletterSection key={section.id} />;
    // Add other cases here for new section types like 'testimonials'
    default:
      return (
        <div key={section.id} className="container mx-auto py-12 text-center">
          <p className="text-red-500">Unknown section type: {section.type}</p>
        </div>
      );
  }
};

const getFeaturedProducts = () => {
    return allProducts.slice(0, 4);
};

const getHeroImage = () => {
    const image = PlaceHolderImages.find(img => img.id === 'hero-watch');
    if (!image) {
        return {
            src: 'https://picsum.photos/seed/storefront-hero/1200/800',
            alt: 'Hero Image',
            'data-ai-hint': 'elegant storefront display'
        }
    }
    return {
        src: image.imageUrl,
        alt: image.description,
        'data-ai-hint': image.imageHint,
    }
}

const defaultSections = [
    { id: 'hero', type: 'hero' },
    { id: 'featured-products', type: 'featured-collection' },
];

export default function StorefrontPage() {
    const [sections, setSections] = useState(defaultSections);
    const featuredProducts: Product[] = getFeaturedProducts();
    const heroImage = getHeroImage();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Optional: Add a check for the event origin for security
            // if (event.origin !== 'http://localhost:9002') return;

            if (event.data.type === 'UPDATE_SECTIONS') {
                setSections(event.data.sections);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <>
            {sections.map(section => renderSection(section, featuredProducts, heroImage))}
        </>
    );
}


function HeroSection({ heroImage }: { heroImage: any }) {
    return (
        <section className="py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <Image
                        src={heroImage.src}
                        alt={heroImage.alt}
                        width={1200}
                        height={800}
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                        data-ai-hint={heroImage['data-ai-hint']}
                    />
                    <div className="flex flex-col justify-center space-y-4">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Discover Our Curated Collection</h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                            Explore a world of hand-picked items that blend quality craftsmanship with timeless design.
                        </p>
                        <Link href="/storefront/catalog" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-fit">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturedProductsSection({ products }: { products: Product[] }) {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Products</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                        Check out some of our favorite and most popular items.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map(product => (
                        <Card key={product.id}>
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
            </div>
        </section>
    );
}

function NewsletterSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Stay in the Loop</h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                        Subscribe to our newsletter to get the latest updates on new arrivals, special offers, and more.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <form className="flex space-x-2">
                        <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                        <Button type="submit">Subscribe</Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}

